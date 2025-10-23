<template>
  <div class="services-container">
    <div class="services-page">
      <!-- Header -->
      <div class="header">
        <Title :level="2">
          <span>
            <UserOutlined />
          </span>
          Xizmatlar
        </Title>
        <p class="header-subtitle">Biz sizga yugori darajada xizmatlarni taklif qilamiz</p>
      </div>

      <!-- Search Section -->
      <div class="header">
        <Input v-model:value="search" size="large" placeholder="Xizmatni qidiring..." allow-clear
          @pressEnter="onSearchEnter" style="max-width: 360px; width: 100%;" class="input-search">
        <template #prefix>
          <SearchOutlined />
        </template>
        </Input>
      </div>

      <!-- Servicies -->
      <Row :gutter="[16, 16]" class="cards-row">
        <Col v-for="service in paginatedServices" :key="service.id" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <Card hoverable class="service-card" @click="openModal(service)">
          <template #title>
            <div class="card-title-wrapper">
              <MedicineBoxOutlined class="card-icon" />
              <span>{{ service.title }}</span>
            </div>
          </template>
          <div class="card-content">
            <p class="service-specialty">
              <UserOutlined style="margin-right: 5px" />
              {{ service.specialty }}
            </p>
            <p class="service-desc">{{ truncate(service.description, 100) }}</p>
            <div class="card-meta">
              <Tag :color="getLevelColor(service.level)">
                {{ service.level }}
              </Tag>
              <span class="doctors-count">
                <TeamOutlined style="margin-right: 5px" />
                {{ countDoctors(service.specialty) }} doktor
              </span>
            </div>
          </div>
        </Card>
        </Col>
      </Row>

      <!-- Pagination -->
      <div class="pagination-wrap">
        <Pagination v-model:current="currentPage" :page-size="pageSize" :total="filteredServices.length"
          @change="onPageChange" :show-size-changer="paginatedServices.length >= 10" />
      </div>

      <!-- Xizmat modal -->
      <Modal v-model:open="modalVisible" :title="selectedService?.title" :width="720" @cancel="closeModal"
        :footer="null" destroyOnClose>
        <div v-if="selectedService" class="modal-content">
          <Descriptions bordered :column="1" size="middle">
            <Descriptions-item label="Ta'rif">
              {{ selectedService.description }}
            </Descriptions-item>
            <Descriptions-item label="Mutaxassislik">
              <Tag color="blue">{{ selectedService.specialty }}</Tag>
            </Descriptions-item>
            <Descriptions-item label="Daraja">
              <Tag :color="getLevelColor(selectedService.level)">
                {{ selectedService.level }}
              </Tag>
            </Descriptions-item>
          </Descriptions>

          <Divider orientation="middle">
            <TeamOutlined /> Ushbu xizmatni bajara oladigan doktorlar
          </Divider>

          <div v-if="matchedDoctors.length" class="doctors-list">
            <List :data-source="matchedDoctors" :grid="{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }">
              <template #renderItem="{ item }">
                <List-item>
                  <Card hoverable class="doctor-card">
                    <div class="doctor-header">
                      <Avatar :size="50" style="background-color: #667eea">
                        <template #icon>
                          <UserOutlined />
                        </template>
                      </Avatar>
                      <div class="doctor-info">
                        <div class="doctor-name">{{ item.fullName }}</div>
                        <div class="doctor-specialty">
                          <MedicineBoxOutlined style="margin-right: 5px" />
                          {{ item.specialty }}
                        </div>
                      </div>
                    </div>

                    <Divider style="margin: 12px 0" />

                    <div class="doctor-details">
                      <p>
                        <ClockCircleOutlined style="color: #667eea; margin-right: 5px" />
                        <strong>Tajriba:</strong> {{ item.experience }} yil
                      </p>
                      <p>
                        <CalendarOutlined style="color: #667eea; margin-right: 5px" />
                        <strong>Ish kunlari:</strong> {{ item.workDays }}
                      </p>
                      <p>
                        <DollarOutlined style="color: #667eea; margin-right: 5px" />
                        <strong>Konsultatsiya:</strong> {{ formatMoney(item.consultationFee) }}
                      </p>
                      <p>
                        <BankOutlined style="color: #667eea; margin-right: 5px" />
                        <strong>Ta'lim:</strong> {{ item.education }}
                      </p>
                    </div>

                    <Button type="primary" block @click="onSelectDoctor(item)" style="margin-top: 10px">
                      <EyeOutlined /> Ko'rish
                    </Button>
                  </Card>
                </List-item>
              </template>
            </List>
          </div>

          <Empty v-else description="Ushbu xizmatga mos doktor topilmadi" />
        </div>
      </Modal>
    </div>
  </div>
</template>

<script setup>
//Vue
import { ref, computed, onMounted, toRaw } from 'vue';
//ANTD
import {
  Typography,
  Row,
  Col,
  Input,
  Tag,
  Card,
  Divider,
  Button,
  Avatar,
  Descriptions,
  DescriptionsItem,
  List,
  ListItem,
  Empty,
  Modal,
  Pagination
} from 'ant-design-vue';
import { message } from 'ant-design-vue';
import {
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  BankOutlined,
  EyeOutlined,
} from '@ant-design/icons-vue';

//FireBase
import { collection, getDocs } from "firebase/firestore";
import { db } from '@/FireBase/config';

const { Title } = Typography

// --- Doktorlar massiv ---
const doctors = [
  { id: 1, fullName: 'Jamshid Aliyev', specialty: 'Kardiolog', experience: 15, workDays: 'Dush-Juma', consultationFee: 150000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 2, fullName: 'Malika Karimova', specialty: 'Stomatolog', experience: 8, workDays: 'Dush-Shanba', consultationFee: 120000, education: 'Samarqand tibbiyot instituti' },
  { id: 3, fullName: 'Bobur Rahimov', specialty: 'Urolog', experience: 12, workDays: 'Sesh-Juma', consultationFee: 180000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 4, fullName: 'Dilnoza Ahmadova', specialty: 'Pediatr', experience: 10, workDays: 'Dush-Shanba', consultationFee: 100000, education: 'Andijon tibbiyot instituti' },
  { id: 5, fullName: 'Aziz Tursunov', specialty: 'Nevrolog', experience: 20, workDays: 'Dush-Juma', consultationFee: 200000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 6, fullName: 'Sevara Yusupova', specialty: 'Dermatolog', experience: 7, workDays: 'Chor-Shanba', consultationFee: 130000, education: 'Buxoro tibbiyot instituti' },
  { id: 7, fullName: 'Otabek Nazarov', specialty: 'Ortoped', experience: 14, workDays: 'Dush-Juma', consultationFee: 170000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 8, fullName: 'Nodira Ismailova', specialty: 'Ginekolog', experience: 11, workDays: 'Dush-Shanba', consultationFee: 160000, education: 'Samarqand tibbiyot instituti' },
  { id: 9, fullName: 'Rustam Ergashev', specialty: 'Oftalmolog', experience: 9, workDays: 'Sesh-Juma', consultationFee: 140000, education: "Farg'ona tibbiyot instituti" },
  { id: 10, fullName: 'Zilola Mahmudova', specialty: 'Endokrinolog', experience: 13, workDays: 'Dush-Shanba', consultationFee: 175000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 11, fullName: 'Jasur Abdullayev', specialty: 'Lor', experience: 16, workDays: 'Dush-Juma', consultationFee: 135000, education: 'Namangan tibbiyot instituti' },
  { id: 12, fullName: 'Feruza Hasanova', specialty: 'Terapevt', experience: 6, workDays: 'Dush-Shanba', consultationFee: 90000, education: 'Andijon tibbiyot instituti' },
  { id: 13, fullName: 'Sanjar Umarov', specialty: 'Xirurg', experience: 18, workDays: 'Dush-Juma', consultationFee: 250000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 14, fullName: 'Muhabbat Saidova', specialty: 'Allergolog', experience: 5, workDays: 'Chor-Shanba', consultationFee: 110000, education: 'Buxoro tibbiyot instituti' },
  { id: 15, fullName: 'Davron Mirzayev', specialty: 'Gastroenterolog', experience: 17, workDays: 'Sesh-Juma', consultationFee: 190000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 16, fullName: 'Gulnora Qodirova', specialty: 'Stomatolog', experience: 12, workDays: 'Dush-Shanba', consultationFee: 125000, education: 'Samarqand tibbiyot instituti' },
  { id: 17, fullName: 'Ilhom Sharipov', specialty: 'Urolog', experience: 10, workDays: 'Dush-Juma', consultationFee: 165000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 18, fullName: 'Kamola Nurmatova', specialty: 'Pediatr', experience: 8, workDays: 'Dush-Shanba', consultationFee: 95000, education: "Farg'ona tibbiyot instituti" },
  { id: 19, fullName: 'Sherzod Holmatov', specialty: 'Kardiolog', experience: 14, workDays: 'Sesh-Juma', consultationFee: 185000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 20, fullName: 'Adolat Rashidova', specialty: 'Nevrolog', experience: 11, workDays: 'Dush-Shanba', consultationFee: 170000, education: 'Samarqand tibbiyot instituti' },
];

// --- Xizmatlar massiv ---
const services = [
  { id: 1, title: 'Kardiologiya (Tashxis & Davolash)', specialty: 'Kardiolog', description: 'Yurak kasalliklarini tashxislash va davolash: EKQ, stress-test, gipotoniya, gipertenziya va boshqalar.', level: 'Advanced' },
  { id: 2, title: 'Stomatologiya', specialty: 'Stomatolog', description: 'Profilaktika, plombalash, protezlash, og\'riqsiz tish davolash va kosmetik stomatologiya xizmatlari.', level: 'Standard' },
  { id: 3, title: 'Urologiya', specialty: 'Urolog', description: 'Buyrak va siydik yo\'llari kasalliklari tashxisi va jarrohlik muolajalari.', level: 'Advanced' },
  { id: 4, title: 'Pediatriya', specialty: 'Pediatr', description: 'Bolalar sog\'lig\'i, emlashlar, rivojlanish monitoringi va shoshilinch yordam.', level: 'Standard' },
  { id: 5, title: 'Nevrologiya', specialty: 'Nevrolog', description: 'Nerv tizimi kasalliklari: bosh og\'rig\'i, uyqusizlik, asab kasalliklarini tashxislash va davolash.', level: 'Advanced' },
  { id: 6, title: 'Dermatologiya', specialty: 'Dermatolog', description: 'Terining kasalliklarini tashxislash va davolash, kosmetik protseduralar.', level: 'Standard' },
  { id: 7, title: 'Ortopediya', specialty: 'Ortoped', description: 'Suyak, bo\'g\'im va mushak kasalliklari; travma va reabilitatsiya.', level: 'Standard' },
  { id: 8, title: 'Ginekologiya', specialty: 'Ginekolog', description: 'Ayollar salomatligi: konsultatsiya, tashxis, homiladorlik monitoringi.', level: 'Advanced' },
  { id: 9, title: 'Oftalmologiya', specialty: 'Oftalmolog', description: 'Ko\'z kasalliklari tashxisi va davolash, kontakt linzalar va ko\'rish tuzatish.', level: 'Standard' },
  { id: 10, title: 'Endokrinologiya', specialty: 'Endokrinolog', description: 'Gormon tashxislari va davolash: qalqonsimon bez, diabet, va boshqalar.', level: 'Advanced' },
  { id: 11, title: 'Lor (ENT)', specialty: 'Lor', description: 'Burun, quloq, tomoq kasalliklari, audiometriya va endoskopiya.', level: 'Standard' },
  { id: 12, title: 'Terapiya', specialty: 'Terapevt', description: 'Ichki organlar kasalliklarini konservativ davolash va konsultatsiya.', level: 'Standard' },
  { id: 13, title: 'Xirurgiya', specialty: 'Xirurg', description: 'Operativ aralashuvlar va jarrohlik muolajalari.', level: 'Advanced' },
  { id: 14, title: 'Allergologiya', specialty: 'Allergolog', description: 'Allergik kasalliklarni tashxislash va immunoterapiya.', level: 'Standard' },
  { id: 15, title: 'Gastroenterologiya', specialty: 'Gastroenterolog', description: 'Ichak va oshqozon kasalliklari tashxisi, endoskopiya xizmatlari.', level: 'Advanced' },
  { id: 16, title: 'Stomatologik (Ortodontiya)', specialty: 'Stomatolog', description: 'Tish to\'g\'rilash va ortodontik xizmatlar.', level: 'Special' },
  { id: 17, title: 'Urologiya (Andrologiya)', specialty: 'Urolog', description: 'Erkak salomatligi va urologik muolajalar.', level: 'Advanced' },
  { id: 18, title: 'Pediatriya (Neonatologiya)', specialty: 'Pediatr', description: 'Yangi tug\'ilgan chaqaloqlar va neonatal parvarish.', level: 'Special' },
  { id: 19, title: 'Kardiologiya (Reabilitatsiya)', specialty: 'Kardiolog', description: 'Yurak kasalliklaridan keyingi reabilitatsiya va nazorat.', level: 'Special' },
  { id: 20, title: 'Nevrologiya (Reabilitatsiya)', specialty: 'Nevrolog', description: 'Asab tizimi kasalliklaridan keyingi reabilitatsiya va fizioterapiya.', level: 'Special' },
];

// --- Reactive state ---
const search = ref('');
const currentPage = ref(1);
const pageSize = 6;
const modalVisible = ref(false);
const selectedService = ref(null);
const serviceDoctors = ref([])
const loading = ref(false)

// --- Computed ---
const filteredServices = computed(() => {
  const q = String(search.value || '').trim().toLowerCase();
  if (!q) return services;
  return services.filter(s =>
    s.title.toLowerCase().includes(q) ||
    (s.description && s.description.toLowerCase().includes(q)) ||
    s.specialty.toLowerCase().includes(q)
  );
});

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredServices.value.slice(start, start + pageSize);
});

const matchedDoctors = computed(() => {
  if (!selectedService.value) return [];
  const spec = normalizeSpecialty(selectedService.value.specialty);
  return doctors.filter(d => normalizeSpecialty(d.specialty) === spec);
});

// --- Methods ---  
function truncate(text, len = 80) {
  if (!text) return '';
  return text.length > len ? text.slice(0, len) + '...' : text;
}

function countDoctors(specialty) {
  return doctors.filter(d => normalizeSpecialty(d.specialty) === normalizeSpecialty(specialty)).length;
}

function normalizeSpecialty(str) {
  if (!str) return '';
  return String(str).toLowerCase().replace(/\s+/g, '');
}

function getLevelColor(level) {
  const colors = {
    'Advanced': 'green',
    'Standard': 'blue',
    'Special': 'purple'
  };
  return colors[level] || 'default';
}

function formatMoney(amount) {
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m';
}

function openModal(service) {
  selectedService.value = service;
  modalVisible.value = true;
}

function closeModal() {
  modalVisible.value = false;
  selectedService.value = null;
}

function onSelectDoctor(doctor) {
  message.success(`${doctor.fullName} tanlandi!`);
  // Keyinchalik: router.push(`/doctors/${doctor.id}`)
}

function onPageChange(page) {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function onSearchEnter() {
  currentPage.value = 1;
}
onMounted(() => {
  const getDoctors = async () => {
    loading.value = true;
    try {
      const querySnapshot = await getDocs(collection(db, 'doctors'));
      serviceDoctors.value = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc
        }
      })
    } catch (error) {
      message.error(error.message)
    } finally {
      loading = false;
    }
  }
  getDoctors()
})

</script>

<style scoped>
.services-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.services-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
}

.header {
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-subtitle {
  margin: 8px 0px 0px 48px;
  color: #8c8c8c;
  font-size: 14px;
}

.input-search {
  max-width: 500px;
}

.cards-row {
  margin-top: 8px;
}

.service-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  border: 2px solid transparent;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.card-title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}

.card-icon {
  color: #667eea;
  font-size: 1.2rem;
}

.card-content {
  min-height: 150px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.service-specialty {
  font-weight: 600;
  color: #667eea;
  margin: 0;
  display: flex;
  align-items: center;
}

.service-desc {
  color: #4a5568;
  margin: 0;
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.6;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #e2e8f0;
}

.doctors-count {
  color: #718096;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

/* Modal */
.modal-content {
  max-height: 70vh;
  overflow-y: auto;
}

.doctors-list {
  margin-top: 16px;
}

.doctor-card {
  border-radius: 12px;
  transition: all 0.3s;
  height: 100%;
}

.doctor-card:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.doctor-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.doctor-info {
  flex: 1;
}

.doctor-name {
  font-weight: 600;
  font-size: 1rem;
  color: #2d3748;
  margin-bottom: 4px;
}

.doctor-specialty {
  color: #667eea;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.doctor-details {
  font-size: 0.9rem;
}

.doctor-details p {
  margin: 8px 0;
  color: #4a5568;
  display: flex;
  align-items: center;
}

/* Pagination */
.pagination-wrap {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Responsive */
@media (max-width: 768px) {
  .services-page {
    padding: 16px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header h2 {
    width: 100%;
    margin-bottom: 8px;
    font-size: 1.5rem;
  }

  .header-subtitle {
    margin-left: 40px;
  }
}

@media (max-width :576px) {
  .header-subtitle {
    margin-left: 36px;
    font-size: 12px;
  }
}
</style>
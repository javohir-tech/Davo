<template>
  <div class="doctors-container">
    <div class="header-section">
      <Title :level="2" class="page-title">
        <span class="title-icon">👨‍⚕️</span>
        Doktorlar
      </Title>
      <p class="subtitle">Klinikamizning malakali mutaxassislari</p>
    </div>

    <!-- Qidiruv bo'limi -->
    <div class="search-section">
      <Input
        v-model:value="searchQuery"
        placeholder="Doktor ismi yoki mutaxassisligini kiriting..."
        size="large"
        class="search-input"
        allowClear
      >
        <template #prefix>
          <SearchOutlined class="search-icon" />
        </template>
      </Input>
      <div v-if="searchQuery" class="search-results-info">
        {{ filteredDoctors.length }} ta natija topildi
      </div>
    </div>

    <!-- Doktorlar jadvali -->
    <div class="table-section">
      <Table
        :columns="columns"
        :data-source="filteredDoctors"
        :pagination="{
          current: currentPage,
          pageSize: pageSize,
          total: filteredDoctors.length,
          showSizeChanger: false,
          showTotal: (total) => `Jami: ${total} ta doktor`
        }"
        :scroll="{ x: 'max-content' }"
        :loading="false"
        rowKey="id"
        class="doctors-table"
        @change="(pagination) => currentPage = pagination.current"
      >
        <!-- Doktor ismi ustuni -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'fullName'">
            <a @click="viewDoctor(record.id)" class="doctor-name">
              {{ record.fullName }}
            </a>
          </template>

          <!-- Mutaxassislik ustuni -->
          <template v-else-if="column.key === 'specialty'">
            <span class="specialty-tag">{{ record.specialty }}</span>
          </template>

          <!-- Tajriba ustuni -->
          <template v-else-if="column.key === 'experience'">
            <span class="experience-badge">
              {{ record.experience }} yil
            </span>
          </template>

          <!-- Qabul kunlari ustuni -->
          <template v-else-if="column.key === 'workDays'">
            <span class="work-days">{{ record.workDays }}</span>
          </template>

          <!-- Narx ustuni -->
          <template v-else-if="column.key === 'consultationFee'">
            <span class="price-tag">{{ record.consultationFee.toLocaleString() }} so'm</span>
          </template>

          <!-- Amallar ustuni -->
          <template v-else-if="column.key === 'actions'">
            <!-- Desktop: Tugma -->
            <Button
              type="link"
              size="small"
              @click="viewDoctor(record.id)"
              class="desktop-action"
            >
              <EyeOutlined />
              <span class="btn-text">Batafsil</span>
            </Button>

            <!-- Mobile: Dropdown Menu -->
            <Dropdown class="mobile-action" :trigger="['click']">
              <Button type="text" size="small" class="more-btn">
                <MoreOutlined style="font-size: 20px;" />
              </Button>
              <template #overlay>
                <Menu>
                  <MenuItem key="view" @click="viewDoctor(record.id)">
                    <EyeOutlined /> Batafsil ko'rish
                  </MenuItem>
                </Menu>
              </template>
            </Dropdown>
          </template>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { Table, Input, Button, Typography, Dropdown, Menu } from 'ant-design-vue';
import { SearchOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons-vue';

const { Title } = Typography;

// Mock doktorlar ma'lumotlari
const mockDoctors = [
  { id: 1, fullName: 'Jamshid Aliyev', specialty: 'Kardiolog', experience: 15, workDays: 'Dush-Juma', consultationFee: 150000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 2, fullName: 'Malika Karimova', specialty: 'Stomatolog', experience: 8, workDays: 'Dush-Shanba', consultationFee: 120000, education: 'Samarqand tibbiyot instituti' },
  { id: 3, fullName: 'Bobur Rahimov', specialty: 'Urolog', experience: 12, workDays: 'Sesh-Juma', consultationFee: 180000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 4, fullName: 'Dilnoza Ahmadova', specialty: 'Pediatr', experience: 10, workDays: 'Dush-Shanba', consultationFee: 100000, education: 'Andijon tibbiyot instituti' },
  { id: 5, fullName: 'Aziz Tursunov', specialty: 'Nevrolog', experience: 20, workDays: 'Dush-Juma', consultationFee: 200000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 6, fullName: 'Sevara Yusupova', specialty: 'Dermatolog', experience: 7, workDays: 'Chor-Shanba', consultationFee: 130000, education: 'Buxoro tibbiyot instituti' },
  { id: 7, fullName: 'Otabek Nazarov', specialty: 'Ortoped', experience: 14, workDays: 'Dush-Juma', consultationFee: 170000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 8, fullName: 'Nodira Ismailova', specialty: 'Ginekolog', experience: 11, workDays: 'Dush-Shanba', consultationFee: 160000, education: 'Samarqand tibbiyot instituti' },
  { id: 9, fullName: 'Rustam Ergashev', specialty: 'Oftalmolog', experience: 9, workDays: 'Sesh-Juma', consultationFee: 140000, education: 'Farg\'ona tibbiyot instituti' },
  { id: 10, fullName: 'Zilola Mahmudova', specialty: 'Endokrinolog', experience: 13, workDays: 'Dush-Shanba', consultationFee: 175000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 11, fullName: 'Jasur Abdullayev', specialty: 'Lor', experience: 16, workDays: 'Dush-Juma', consultationFee: 135000, education: 'Namangan tibbiyot instituti' },
  { id: 12, fullName: 'Feruza Hasanova', specialty: 'Terapevt', experience: 6, workDays: 'Dush-Shanba', consultationFee: 90000, education: 'Andijon tibbiyot instituti' },
  { id: 13, fullName: 'Sanjar Umarov', specialty: 'Xirurg', experience: 18, workDays: 'Dush-Juma', consultationFee: 250000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 14, fullName: 'Muhabbat Saidova', specialty: 'Allergolog', experience: 5, workDays: 'Chor-Shanba', consultationFee: 110000, education: 'Buxoro tibbiyot instituti' },
  { id: 15, fullName: 'Davron Mirzayev', specialty: 'Gastroenterolog', experience: 17, workDays: 'Sesh-Juma', consultationFee: 190000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 16, fullName: 'Gulnora Qodirova', specialty: 'Stomatolog', experience: 12, workDays: 'Dush-Shanba', consultationFee: 125000, education: 'Samarqand tibbiyot instituti' },
  { id: 17, fullName: 'Ilhom Sharipov', specialty: 'Urolog', experience: 10, workDays: 'Dush-Juma', consultationFee: 165000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 18, fullName: 'Kamola Nurmatova', specialty: 'Pediatr', experience: 8, workDays: 'Dush-Shanba', consultationFee: 95000, education: 'Farg\'ona tibbiyot instituti' },
  { id: 19, fullName: 'Sherzod Holmatov', specialty: 'Kardiolog', experience: 14, workDays: 'Sesh-Juma', consultationFee: 185000, education: 'Toshkent tibbiyot akademiyasi' },
  { id: 20, fullName: 'Adolat Rashidova', specialty: 'Nevrolog', experience: 11, workDays: 'Dush-Shanba', consultationFee: 170000, education: 'Samarqand tibbiyot instituti' },
];

export default {
  name: 'DoctorsList',
  components: {
    Table,
    Input,
    Button,
    Title,
    Dropdown,
    Menu,
    MenuItem: Menu.Item,
    SearchOutlined,
    EyeOutlined,
    MoreOutlined,
  },
  setup() {
    const searchQuery = ref('');
    const currentPage = ref(1);
    const pageSize = ref(10);

    // Qidiruv funksiyasi (ism va mutaxassislik bo'yicha)
    const filteredDoctors = computed(() => {
      if (!searchQuery.value) {
        return mockDoctors;
      }
      const query = searchQuery.value.toLowerCase();
      return mockDoctors.filter(doctor =>
        doctor.fullName.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query)
      );
    });

    // Jadval ustunlari
    const columns = [
      {
        title: 'F.I.O',
        dataIndex: 'fullName',
        key: 'fullName',
      },
      {
        title: 'Mutaxassislik',
        dataIndex: 'specialty',
        key: 'specialty',
      },
      {
        title: 'Tajriba',
        dataIndex: 'experience',
        key: 'experience',
        responsive: ['md']
      },
      {
        title: 'Qabul kunlari',
        dataIndex: 'workDays',
        key: 'workDays',
        responsive: ['lg']
      },
      {
        title: 'Qabul narxi',
        dataIndex: 'consultationFee',
        key: 'consultationFee',
        responsive: ['md']
      },
      {
        title: 'Amallar',
        key: 'actions',
        align: 'center',
      }
    ];

    // Doktor sahifasiga o'tish
    const viewDoctor = (doctorId) => {
      console.log(`Doktor sahifasiga o'tish: /doctors/${doctorId}`);
      // Router push qilish uchun:
      // router.push({ name: 'DoctorDetail', params: { id: doctorId } });
      alert(`Doktor #${doctorId} sahifasiga o'tiladi (router keyinchalik qo'shiladi)`);
    };

    return {
      searchQuery,
      currentPage,
      pageSize,
      filteredDoctors,
      columns,
      viewDoctor
    };
  }
}
</script>

<style scoped>
.doctors-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
}

/* Header bo'limi */
.header-section {
  background: white;
  padding: 32px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.page-title {
  margin: 0 !important;
  color: #1890ff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 36px;
}

.subtitle {
  margin: 8px 0 0 48px;
  color: #8c8c8c;
  font-size: 14px;
}

/* Qidiruv bo'limi */
.search-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-input {
  max-width: 600px;
}

.search-icon {
  color: #1890ff;
  font-size: 18px;
}

.search-results-info {
  margin-top: 12px;
  color: #52c41a;
  font-weight: 500;
  font-size: 14px;
}

/* Jadval bo'limi */
.table-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.doctors-table :deep(.ant-table) {
  font-size: 14px;
}

.doctors-table :deep(.ant-table-thead > tr > th) {
  background: #fafafa;
  font-weight: 600;
  color: #262626;
  border-bottom: 2px solid #f0f0f0;
}

.doctors-table :deep(.ant-table-tbody > tr:hover) {
  background: #f5f9ff;
}

/* Doktor ismi */
.doctor-name {
  color: #1890ff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

.doctor-name:hover {
  color: #40a9ff;
  text-decoration: underline;
}

/* Mutaxassislik tagi */
.specialty-tag {
  padding: 4px 12px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #91d5ff;
}

/* Tajriba badge */
.experience-badge {
  padding: 4px 12px;
  background: #f6ffed;
  color: #52c41a;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #b7eb8f;
}

/* Qabul kunlari */
.work-days {
  color: #595959;
  font-size: 13px;
}

/* Narx tagi */
.price-tag {
  color: #fa8c16;
  font-weight: 600;
  font-size: 14px;
}

/* Amallar tugmalari */
.desktop-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  font-size: 13px;
}

.mobile-action {
  display: none;
}

.more-btn {
  color: #1890ff;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
}

.more-btn:hover {
  color: #40a9ff;
  background: #f0f7ff;
}

/* Desktop: default tugma */
@media (min-width: 769px) {
  .mobile-action {
    display: none !important;
  }
  
  .desktop-action {
    display: inline-flex !important;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .doctors-container {
    padding: 16px;
  }

  .header-section {
    padding: 20px;
  }

  .page-title {
    font-size: 24px !important;
  }

  .title-icon {
    font-size: 28px;
  }

  .subtitle {
    margin-left: 40px;
  }

  .search-section {
    padding: 16px;
  }

  .search-input {
    max-width: 100%;
  }

  .table-section {
    padding: 16px;
  }

  /* Mobile: Dropdown ko'rsatish */
  .desktop-action {
    display: none !important;
  }

  .mobile-action {
    display: inline-block !important;
  }

  .btn-text {
    display: none;
  }

  .doctors-table :deep(.ant-table) {
    font-size: 13px;
  }

  /* Jadval ustunlarini optimizatsiya */
  .doctors-table :deep(.ant-table-cell) {
    padding: 12px 8px;
  }

  /* Doktor ismi ustuni */
  .doctors-table :deep(.ant-table-cell:first-child) {
    min-width: 150px;
    max-width: 200px;
  }

  /* Amallar ustuni */
  .doctors-table :deep(.ant-table-cell:last-child) {
    width: 50px !important;
    min-width: 50px !important;
    padding: 8px 4px !important;
  }
}

@media (max-width: 576px) {
  .page-title {
    font-size: 20px !important;
  }

  .title-icon {
    font-size: 24px;
  }

  .subtitle {
    font-size: 12px;
    margin-left: 36px;
  }
}
</style>
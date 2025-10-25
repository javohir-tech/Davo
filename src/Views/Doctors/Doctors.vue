<template>
  <div class="doctors-container">
    <!--header sections-->
    <div class="header-section">
      <Title :level="2" class="page-title">
        <span class="title-icon">👨‍⚕️</span>
        Doktorlar
      </Title>
      <p class="subtitle">Klinikamizning malakali mutaxassislari</p>
    </div>

    <!-- Qidiruv bo'limi -->
    <div class="search-section">
      <Input v-model:value="searchQuery" placeholder="Doktor ismi yoki mutaxassisligini kiriting..." size="large"
        class="search-input" allowClear>
      <template #prefix>
        <SearchOutlined class="search-icon" />
      </template>
      </Input>
      <div v-if="searchQuery" class="search-results-info">
        {{ filteredDoctors.length }} ta natija topildi
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large" tip="Yuklanmoqda..." />
    </div>

    <!-- Doktorlar kartochkalari -->
    <div v-else class="cards-wrapper">
      <!-- Natijalar soni -->
      <div class="results-header">
        <div class="results-count">
          <span class="count-badge">{{ filteredDoctors.length }}</span>
          <span class="count-text">ta doktor</span>
        </div>
      </div>

      <!-- Cards Grid -->
      <div v-if="paginatedDoctors.length > 0" class="cards-grid">
        <div v-for="doctor in paginatedDoctors" :key="doctor.id" class="doctor-card">
          <!-- Card header with avatar -->
          <div class="card-header">
            <div class="avatar-wrapper">
              <img v-if="doctor.image" :src="doctor.image" :alt="doctor.fullName" class="doctor-avatar" />
              <div v-else class="doctor-avatar-placeholder">
                {{ getInitials(doctor.fullName) }}
              </div>
              <div class="online-indicator"></div>
            </div>
            <div class="experience-tag">
              {{ doctor.experience }} yil tajriba
            </div>
          </div>

          <!-- Card body -->
          <div class="card-body">
            <h3 class="doctor-name">{{ doctor.fullName }}</h3>

            <div class="specialty-wrapper">
              <span class="specialty-badge">{{ doctor.specialty }}</span>
            </div>

            <div class="doctor-details">
              <div class="detail-row">
                <CalendarOutlined class="detail-icon" />
                <span class="detail-text">{{ doctor.workDays }}</span>
              </div>

              <div class="detail-row">
                <ClockCircleOutlined class="detail-icon" />
                <span class="detail-text">{{ doctor.workTime }}</span>
              </div>

              <div class="detail-row">
                <PhoneOutlined class="detail-icon" />
                <span class="detail-text">{{ doctor.phone }}</span>
              </div>
            </div>

            <!-- Price section -->
            <div class="price-section">
              <div class="price-label">Konsultatsiya:</div>
              <div class="price-value">
                {{ doctor.consultationFee.toLocaleString() }}
                <span class="currency">so'm</span>
              </div>
            </div>
          </div>

          <!-- Card footer -->
          <div class="card-footer">
            <Button type="primary" block class="appointment-btn" @click="viewDoctor(doctor.id)">
              <CalendarOutlined />
              Qabulga yozilish
            </Button>
          </div>
        </div>
      </div>

      <!-- Agar natija topilmasa -->
      <div v-else class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3 class="no-results-title">Doktor topilmadi</h3>
        <p class="no-results-text">Boshqa ism yoki mutaxassislik bilan qidirib ko'ring</p>
      </div>

      <!-- Pagination -->
      <div v-if="filteredDoctors.length > pageSize" class="pagination-wrapper">
        <a-pagination v-model:current="currentPage" :total="filteredDoctors.length" :page-size="pageSize"
          :show-size-changer="false" @change="handlePageChange"
          :show-total="(total, range) => `${range[0]}-${range[1]} / ${total} ta doktor`" />
      </div>
    </div>
  </div>
</template>

<script setup>
//VUE
import { ref, computed, onMounted, watch } from 'vue';
//ANTD
import { Input, Button, Typography } from 'ant-design-vue';
import { SearchOutlined, CalendarOutlined, ClockCircleOutlined, PhoneOutlined } from '@ant-design/icons-vue';
//Hooks
import useDocs from '@/Hooks/useDocs';

const { data, loading, getData } = useDocs('doctors')

const { Title } = Typography;

const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(12);

// Qidiruv funksiyasi
const filteredDoctors = computed(() => {
  if (!searchQuery.value) {
    return data.value;
  }
  const query = searchQuery.value.toLowerCase();
  return data.value.filter(doctor =>
    doctor.fullName.toLowerCase().includes(query) ||
    doctor.specialty.toLowerCase().includes(query)
  );
});

// Pagination
const paginatedDoctors = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredDoctors.value.slice(start, end);
});

// Doktor ismidan bosh harflarni olish
const getInitials = (fullName) => {
  const names = fullName.split(' ');
  if (names.length >= 2) {
    return names[0][0] + names[1][0];
  }
  return names[0][0];
};

// Doktor sahifasiga o'tish
const viewDoctor = (doctorId) => {
  console.log(`Doktor sahifasiga o'tish: /doctors/${doctorId}`);
  alert(`Doktor #${doctorId} sahifasiga o'tiladi (router keyinchalik qo'shiladi)`);
};

// Sahifa o'zgarganda
const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  getData()
})

watch(searchQuery, () => {
  currentPage.value = 1
})

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

/* Loading */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 12px;
}

/* Cards wrapper */
.cards-wrapper {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* Results header */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.results-count {
  display: flex;
  align-items: center;
  gap: 8px;
}

.count-badge {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 16px;
}

.count-text {
  color: #8c8c8c;
  font-size: 15px;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

/* Doctor Card */
.doctor-card {
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.doctor-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  border-color: #1890ff;
}

/* Card Header */
.card-header {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  padding: 24px 20px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.card-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -30%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 12px;
  z-index: 1;
}

.doctor-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.doctor-avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.online-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  background: #52c41a;
  border: 3px solid white;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.experience-tag {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 1;
}

/* Card Body */
.card-body {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: -40px;
  position: relative;
  z-index: 2;
}

.doctor-name {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0;
  text-align: center;
  line-height: 1.3;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.specialty-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.specialty-badge {
  padding: 6px 16px;
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  color: #1890ff;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #91d5ff;
  display: inline-block;
}

.doctor-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: #fafafa;
  border-radius: 12px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-icon {
  font-size: 16px;
  color: #1890ff;
  min-width: 20px;
}

.detail-text {
  font-size: 13px;
  color: #595959;
  line-height: 1.4;
}

/* Price Section */
.price-section {
  background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
  padding: 12px;
  border-radius: 12px;
  margin-top: auto;
  text-align: center;
}

.price-label {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.price-value {
  font-size: 20px;
  font-weight: 700;
  color: #fa8c16;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.currency {
  font-size: 13px;
  font-weight: 500;
  color: #8c8c8c;
}

/* Card Footer */
.card-footer {
  padding: 12px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
}

.appointment-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  border-radius: 8px;
  font-weight: 600;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border: none;
  transition: all 0.3s;
  font-size: 14px;
}

.appointment-btn:hover {
  background: linear-gradient(135deg, #73d13d 0%, #95de64 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
}

/* No results */
.no-results {
  text-align: center;
  padding: 80px 20px;
}

.no-results-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.no-results-title {
  color: #595959;
  font-size: 20px;
  margin-bottom: 8px;
}

.no-results-text {
  color: #8c8c8c;
  font-size: 14px;
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding-top: 24px;
  border-top: 2px solid #f0f0f0;
}

/* Responsive */
@media (max-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

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

  .cards-wrapper {
    padding: 16px;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
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

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .doctor-avatar,
  .doctor-avatar-placeholder {
    width: 90px;
    height: 90px;
  }

  .doctor-avatar-placeholder {
    font-size: 32px;
  }

  .doctor-name {
    font-size: 16px;
    min-height: auto;
  }
}
</style>
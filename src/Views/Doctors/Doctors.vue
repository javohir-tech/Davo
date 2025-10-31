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
      <Input ref="searchInput" v-model:value="searchQuery" placeholder="Doktor ismi yoki mutaxassisligini kiriting..."
        size="large" class="search-input" allowClear>
      <template #prefix>
        <SearchOutlined class="search-icon" />
      </template>
      <template #suffix>
        <p class="ctrl">Ctrl+K</p>
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

      <!-- Cards Grid using Ant Design Grid -->
      <Row v-if="paginatedDoctors.length > 0" :gutter="[16, 16]">
        <Col v-for="doctor in paginatedDoctors" :key="doctor.id" :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <div class="doctor-card" @click="viewDoctor(doctor.id)">
          <!-- Card Header with Avatar and Info -->
          <div class="card-header">
            <!-- Avatar Section -->
            <div class="avatar-wrapper">
              <img v-if="doctor.image" :src="doctor.image" :alt="doctor.fullName" class="doctor-avatar" />
              <div v-else class="doctor-avatar-placeholder">
                {{ getInitials(doctor.fullName) }}
              </div>
              <div class="online-indicator"></div>
            </div>

            <!-- Info Section -->
            <div class="header-info">
              <h3 class="doctor-name" :title="doctor.fullName">
                {{ truncateText(doctor.fullName, 16) }}
              </h3>
              <div class="specialty-badge" :title="doctor.specialty">
                {{ truncateText(doctor.specialty, 18) }}
              </div>
              <div class="experience-tag">
                ⭐ {{ doctor.experience }} yil
              </div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <!-- Info Items -->
            <div class="info-item">
              <CalendarOutlined class="info-icon" />
              <span class="info-text" :title="doctor.workDays">
                {{ truncateText(doctor.workDays, 12) }}
              </span>
            </div>

            <div class="info-item">
              <ClockCircleOutlined class="info-icon" />
              <span class="info-text">{{ doctor.workHours }}</span>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <div class="price-section">
              <span class="price-label">Konsultatsiya</span>
              <span class="price-value">
                {{ formatPrice(doctor.consultationFee) }}
              </span>
            </div>
            <Button type="primary" class="book-btn" size="small">
              <CalendarOutlined />
            </Button>
          </div>
        </div>
        </Col>
      </Row>

      <!-- Agar natija topilmasa -->
      <div v-else class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3 class="no-results-title">Doktor topilmadi</h3>
        <p class="no-results-text">
          Boshqa ism yoki mutaxassislik bilan qidirib ko'ring
        </p>
      </div>

      <!-- Pagination -->
      <div v-if="filteredDoctors.length > pageSize" class="pagination-wrapper">
        <a-pagination v-model:current="currentPage" :total="filteredDoctors.length" :page-size="pageSize"
          :show-size-changer="false" @change="handlePageChange" :show-total="(total, range) => `${range[0]}-${range[1]} / ${total} ta doktor`
            " />
      </div>
    </div>
  </div>
</template>

<script setup>
//VUE
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
//ANTD
import { Input, Button, Typography, Row, Col } from 'ant-design-vue'
import {
  SearchOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons-vue'
//Hooks
import useDocs from '@/Hooks/useDocs'
//Vue Router
import { useRouter } from 'vue-router'

const router = useRouter()

const { data, loading, getData } = useDocs('doctors')

const { Title } = Typography

const searchQuery = ref('')
const searchInput = ref(null);
const currentPage = ref(1)
const pageSize = ref(12)

// Qidiruv funksiyasi
const filteredDoctors = computed(() => {
  if (!searchQuery.value) {
    return data.value
  }
  const query = searchQuery.value.toLowerCase()
  return data.value.filter(
    (doctor) =>
      doctor.fullName.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query)
  )
})

const handleShortcut = (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    searchInput.value?.focus()
  }
}

// Pagination
const paginatedDoctors = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredDoctors.value.slice(start, end)
})

// Doktor ismidan bosh harflarni olish
const getInitials = (fullName) => {
  const names = fullName.split(' ')
  if (names.length >= 2) {
    return names[0][0] + names[1][0]
  }
  return names[0][0]
}

// Matn qisqartirish
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  }
  return text
}

// Narxni formatlash
const formatPrice = (price) => {
  return price.toLocaleString() + ' so\'m'
}

// Doktor sahifasiga o'tish
const viewDoctor = (doctorId) => {
  router.push(`/doctors/${doctorId}`)
}

// Sahifa o'zgarganda
const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(searchQuery, () => {
  currentPage.value = 1
})

onMounted(() => {
  window.addEventListener('keydown', handleShortcut);
  getData()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleShortcut);
})
</script>

<style scoped>
/* Accissibilty */
.ctrl {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
  font-weight: 500;
}

.doctors-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
}

/* Header bo'limi */
.header-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.page-title {
  margin: 0 !important;
  color: #1890ff;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 32px;
}

.subtitle {
  margin: 6px 0 0 44px;
  color: #8c8c8c;
  font-size: 14px;
}

/* Qidiruv bo'limi */
.search-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.search-input {
  max-width: 600px;
  border-radius: 12px;
}

.search-icon {
  color: #667eea;
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
}

/* Cards wrapper */
.cards-wrapper {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Doctor Card */
.doctor-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
}

.doctor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

/* Card Header - Horizontal Layout */
.card-header {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.card-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -30%;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

/* Avatar Wrapper */
.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
  z-index: 1;
}

.doctor-avatar {
  width: 55px;
  height: 55px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.doctor-avatar-placeholder {
  width: 55px;
  height: 55px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.online-indicator {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 14px;
  height: 14px;
  background: #52c41a;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(82, 196, 26, 0.5);
}

/* Header Info */
.header-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  flex: 1;
  min-width: 0;
  z-index: 1;
}

.doctor-name {
  font-size: 13px;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.specialty-badge {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.9);
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: inline-block;
  align-self: flex-start;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.experience-tag {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
}

/* Card Body */
.card-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
  border-radius: 10px;
  border: 1px solid #e6e9ff;
}

.info-icon {
  font-size: 16px;
  color: #667eea;
  flex-shrink: 0;
}

.info-text {
  font-size: 11px;
  color: #262626;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

/* Card Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
  border-top: 2px solid #ffd591;
}

.price-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.price-label {
  font-size: 9px;
  color: #8c8c8c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price-value {
  font-size: 13px;
  font-weight: 700;
  color: #fa8c16;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
  transition: all 0.3s;
  flex-shrink: 0;
}

.book-btn:hover {
  background: linear-gradient(135deg, #73d13d 0%, #95de64 100%);
  box-shadow: 0 6px 16px rgba(82, 196, 26, 0.4);
}

/* No results */
.no-results {
  text-align: center;
  padding: 60px 20px;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-results-title {
  color: #595959;
  font-size: 18px;
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
  padding-top: 20px;
  margin-top: 20px;
  border-top: 2px solid rgba(102, 126, 234, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .doctors-container {
    padding: 16px;
  }

  .header-section {
    padding: 16px;
  }

  .page-title {
    font-size: 22px !important;
  }

  .title-icon {
    font-size: 26px;
  }

  .subtitle {
    margin-left: 38px;
    font-size: 13px;
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

  .card-header {
    padding: 12px;
    gap: 10px;
  }

  .doctor-avatar,
  .doctor-avatar-placeholder {
    width: 50px;
    height: 50px;
  }

  .doctor-avatar-placeholder {
    font-size: 20px;
  }

  .doctor-name {
    font-size: 12px;
  }

  .specialty-badge {
    font-size: 9px;
    padding: 2px 6px;
  }

  .card-body {
    padding: 12px;
  }

  .info-text {
    font-size: 10px;
  }

  .price-value {
    font-size: 12px;
  }

  .book-btn {
    width: 32px;
    height: 32px;
  }
}
</style>
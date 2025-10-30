<template>
  <div class="medicines-container">
    <!-- Header section-->
    <div class="header-section">
      <Title :level="2" class="page-title">
        <span class="title-icon">💊</span>
        Dorilar
      </Title>
      <p class="subtitle">Barcha dorilar ro'yxati va ma'lumotlari</p>
    </div>

    <div>
      <!-- Qidiruv bo'limi -->
      <div class="search-section">
        <Input v-model:value="searchQuery" placeholder="Dori nomini kiriting..." size="large" class="search-input"
          allowClear>
        <template #prefix>
          <SearchOutlined class="search-icon" />
        </template>
        </Input>
        <div v-if="searchQuery" class="search-results-info">
          {{ filteredMedicines.length }} ta natija topildi
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading && data.length === 0" class="loading-container">
        <a-spin size="large" tip="Yuklanmoqda..." />
      </div>

      <div v-else class="cards-wrapper">
        <Row v-if="paginatedMedicines.length > 0" :gutter="[16, 16]">
          <Col v-for="medicine in paginatedMedicines" :key="medicine.id" :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <div class="medicine-card" @click="handleCardClick(medicine.id, $event)">
              <!-- Card header -->
              <div class="card-header">
                <div class="medicine-icon">💊</div>
                <div :class="[
                  'stock-indicator',
                  medicine.stock < 100 ? 'low-stock' : 'in-stock',
                ]">
                  <span class="stock-dot"></span>
                  {{ medicine.stock < 100 ? 'Kam' : 'Mavjud' }}
                </div>
              </div>

              <!-- Card body -->
              <div class="card-body">
                <h3 class="medicine-name" :title="medicine.name">
                  {{ truncateName(medicine.name, 35) }}
                </h3>

                <div class="medicine-details">
                  <div class="detail-row">
                    <span class="detail-label">Ishlab chiqaruvchi:</span>
                    <span class="detail-value" :title="medicine.manufacturer">
                      {{ truncateText(medicine.manufacturer, 15) }}
                    </span>
                  </div>

                  <div class="detail-row">
                    <span class="detail-label">Kategoriya:</span>
                    <span class="detail-value" :title="medicine.category">
                      {{ truncateText(medicine.category, 15) }}
                    </span>
                  </div>

                  <div class="detail-row">
                    <span class="detail-label">Omborda:</span>
                    <span :class="['stock-value', medicine.stock < 100 ? 'low' : '']">
                      {{ medicine.stock }} ta
                    </span>
                  </div>
                </div>

                <!-- Price section -->
                <div class="price-section">
                  <div class="price-value">
                    {{ medicine.price.toLocaleString() }}
                    <span class="currency">so'm</span>
                  </div>
                </div>
              </div>

              <!-- Card footer -->
              <div class="card-footer" @click.stop>
                <Button v-if="!drugsStore.isSelected(medicine.id)" 
                  :disabled="drugsStore.loadingItems[medicine.id]" 
                  type="primary" 
                  size="small" 
                  class="cart-btn"
                  @click="drugsStore.addDrug(medicine)">
                  <ShoppingCartOutlined />
                  {{ drugsStore.loadingItems[medicine.id] ? 'Loading...' : 'Savat' }}
                </Button>
                <div v-else class="quatity-control">
                  <Button @click="drugsStore.decrementQuantity(medicine.id)" type="primary" class="cart-btn"
                    :icon="h(MinusOutlined)" />
                  <span class="select-count">{{ drugsStore.getQuantity(medicine.id) }}</span>
                  <Button @click="drugsStore.incrementQuantity(medicine.id)" type="primary" class="cart-btn"
                    :icon="h(PlusOutlined)" />
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <!-- Agar natija topilmasa -->
        <div v-else class="no-results">
          <a-empty size="large" :description="data.length === 0 ? '' : 'Dori topilmadi'" />
        </div>

        <!-- Pagination -->
        <div v-if="filteredMedicines.length > pageSize" class="pagination-wrapper">
          <a-pagination v-model:current="currentPage" :total="filteredMedicines.length" :page-size="pageSize"
            :show-size-changer="false" @change="handlePageChange" :show-total="(total, range) => `${range[0]}-${range[1]} / ${total} ta dori`
              " />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, h } from 'vue'
//Antd Components
import { Input, Button, Typography, Row, Col, message } from 'ant-design-vue'
//Antd Icons
import {
  SearchOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons-vue'
//Hooks
import useDocs from '@/Hooks/useDocs'
//Store
import { useDrugsStore } from '@/Store/useDrugsStore'
import { useRouter } from 'vue-router'

const router = useRouter()

const drugsStore = useDrugsStore()

const { data, loading, getData } = useDocs('medicines')

const { Title } = Typography

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(12)

// Qidiruv funksiyasi
const filteredMedicines = computed(() => {
  if (!searchQuery.value) {
    return data.value
  }
  return data.value.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Pagination
const paginatedMedicines = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredMedicines.value.slice(start, end)
})

// Matn qisqartirish
const truncateName = (name, maxLength) => {
  if (name.length > maxLength) {
    return name.substring(0, maxLength) + '...'
  }
  return name
}

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  }
  return text
}

// Card click handler
const handleCardClick = (medicineId, event) => {
  router.push(`/drugs/${medicineId}`)
}

// Sahifa o'zgarganda
const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}


onMounted(() => {
  getData()
  drugsStore.fetchSelectedDrugs()
})

watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.medicines-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
}

/* Header bo'limi */
.header-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 20px;
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
  font-size: 32px;
}

.subtitle {
  margin: 6px 0 0 44px;
  color: #8c8c8c;
  font-size: 14px;
}

/* Qidiruv bo'limi */
.search-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-input {
  max-width: 500px;
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
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* Medicine Card */
.medicine-card {
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
}

.medicine-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  border-color: #1890ff;
}

/* Card Header */
.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.medicine-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.stock-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.stock-indicator.in-stock {
  background: rgba(82, 196, 26, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.stock-indicator.low-stock {
  background: rgba(250, 140, 22, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.stock-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.in-stock .stock-dot {
  background: #52c41a;
}

.low-stock .stock-dot {
  background: #faad14;
}

/* Card Body */
.card-body {
  padding: 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.medicine-name {
  font-size: 15px;
  font-weight: 600;
  color: #262626;
  margin: 0;
  line-height: 1.4;
  min-height: 42px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.medicine-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  gap: 8px;
}

.detail-label {
  font-size: 12px;
  color: #8c8c8c;
  flex-shrink: 0;
}

.detail-value {
  font-size: 12px;
  color: #262626;
  font-weight: 500;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stock-value {
  padding: 2px 8px;
  background: #f6ffed;
  color: #52c41a;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #b7eb8f;
}

.stock-value.low {
  background: #fff7e6;
  color: #fa8c16;
  border-color: #ffd591;
}

/* Price Section */
.price-section {
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  padding: 10px;
  border-radius: 8px;
  margin-top: auto;
}

.price-value {
  font-size: 18px;
  font-weight: 700;
  color: #1890ff;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.currency {
  font-size: 12px;
  font-weight: 500;
  color: #595959;
}

/* Card Footer */
.card-footer {
  padding: 10px;
  display: flex;
  gap: 8px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
}

.cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  border-radius: 6px;
  font-weight: 500;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border: none;
  transition: all 0.3s;
  font-size: 13px;
  flex: 1;
}

.cart-btn:hover {
  background: linear-gradient(135deg, #73d13d 0%, #95de64 100%);
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
}

.quatity-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 8px;
}

.quatity-control .cart-btn {
  width: 32px;
  padding: 0;
}

.select-count {
  font-size: 16px;
  font-weight: 700;
  color: #73d13d;
}

/* No results */
.no-results {
  text-align: center;
  padding: 60px 20px;
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 2px solid #f0f0f0;
}

/* Responsive */
@media (max-width: 768px) {
  .medicines-container {
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

  .medicine-name {
    font-size: 14px;
    min-height: 40px;
  }

  .price-value {
    font-size: 16px;
  }
  
  .detail-label {
    font-size: 11px;
  }
  
  .detail-value {
    font-size: 11px;
  }
}
</style>
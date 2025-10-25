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

    <!-- Qidiruv bo'limi -->
    <div class="search-section">
      <Input
        v-model:value="searchQuery"
        placeholder="Dori nomini kiriting..."
        size="large"
        class="search-input"
        allowClear
      >
        <template #prefix>
          <SearchOutlined class="search-icon" />
        </template>
      </Input>
      <div v-if="searchQuery" class="search-results-info">
        {{ filteredMedicines.length }} ta natija topildi
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large" tip="Yuklanmoqda..." />
    </div>

    <!-- Dorilar kartochkalari -->
    <div v-else class="cards-wrapper">
      <!-- Natijalar soni va tartibga solish -->
      <div class="results-header">
        <div class="results-count">
          <span class="count-badge">{{ filteredMedicines.length }}</span>
          <span class="count-text">ta dori mavjud</span>
        </div>
      </div>

      <!-- Cards Grid -->
      <div v-if="paginatedMedicines.length > 0" class="cards-grid">
        <div
          v-for="medicine in paginatedMedicines"
          :key="medicine.id"
          class="medicine-card"
        >
          <!-- Card header with image -->
          <div class="card-header">
            <div class="medicine-icon">💊</div>
            <div
              :class="[
                'stock-indicator',
                medicine.stock < 100 ? 'low-stock' : 'in-stock',
              ]"
            >
              <span class="stock-dot"></span>
              {{ medicine.stock < 100 ? 'Kam qoldi' : 'Mavjud' }}
            </div>
          </div>

          <!-- Card body -->
          <div class="card-body">
            <h3 class="medicine-name">{{ medicine.name }}</h3>

            <div class="medicine-details">
              <div class="detail-item">
                <span class="detail-label">Ishlab chiqaruvchi:</span>
                <span class="detail-value">{{ medicine.manufacturer }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Kategoriya:</span>
                <span class="detail-value">{{ medicine.category }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Omborda:</span>
                <span
                  :class="['stock-value', medicine.stock < 100 ? 'low' : '']"
                >
                  {{ medicine.stock }} ta
                </span>
              </div>
            </div>

            <!-- Price section -->
            <div class="price-section">
              <div class="price-label">Narxi:</div>
              <div class="price-value">
                {{ medicine.price.toLocaleString() }}
                <span class="currency">so'm</span>
              </div>
            </div>
          </div>

          <!-- Card footer with actions -->
          <div class="card-footer">
            <Button
              type="default"
              block
              class="view-btn"
              @click="viewMedicine(medicine.id)"
            >
              <EyeOutlined />
              Batafsil
            </Button>
            <Button
              type="primary"
              block
              class="cart-btn"
              @click="addToCart(medicine)"
            >
              <ShoppingCartOutlined />
              Savatga
            </Button>
          </div>
        </div>
      </div>

      <!-- Agar natija topilmasa -->
      <div v-else class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3 class="no-results-title">Dori topilmadi</h3>
        <p class="no-results-text">Boshqa nom bilan qidirib ko'ring</p>
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredMedicines.length > pageSize"
        class="pagination-wrapper"
      >
        <a-pagination
          v-model:current="currentPage"
          :total="filteredMedicines.length"
          :page-size="pageSize"
          :show-size-changer="false"
          @change="handlePageChange"
          :show-total="
            (total, range) => `${range[0]}-${range[1]} / ${total} ta dori`
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  //Antd Components
  import { Input, Button, Typography, message } from 'ant-design-vue'
  //Antd Icons
  import {
    SearchOutlined,
    ShoppingCartOutlined,
    EyeOutlined,
  } from '@ant-design/icons-vue'
  //Hooks
  import useDocs from '@/Hooks/useDocs'

  const { data, loading, getData } = useDocs('medicines')

  const { Title } = Typography

  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)

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

  // Dori sahifasiga o'tish
  const viewMedicine = (medicineId) => {
    console.log(`Dori sahifasiga o'tish: /medicines/${medicineId}`)
    alert(
      `Dori #${medicineId} sahifasiga o'tiladi (router keyinchalik qo'shiladi)`
    )
  }

  // Savatga qo'shish
  const addToCart = (medicine) => {
    console.log("Savatga qo'shildi:", medicine)
    message.success(`${medicine.name} savatga qo'shildi`)
  }

  // Sahifa o'zgarganda
  const handlePageChange = (page) => {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(() => {
    getData()
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  /* Medicine Card */
  .medicine-card {
    background: white;
    border: 1px solid #f0f0f0;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .medicine-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    border-color: #1890ff;
  }

  /* Card Header */
  .card-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .card-header::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  .medicine-icon {
    font-size: 40px;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    position: relative;
    z-index: 1;
  }

  .stock-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    position: relative;
    z-index: 1;
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
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .in-stock .stock-dot {
    background: #52c41a;
  }

  .low-stock .stock-dot {
    background: #faad14;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }

    50% {
      opacity: 0.6;
      transform: scale(1.2);
    }
  }

  /* Card Body */
  .card-body {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .medicine-name {
    font-size: 16px;
    font-weight: 600;
    color: #262626;
    margin: 0;
    line-height: 1.4;
    min-height: 18px;
  }

  .medicine-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px dashed #f0f0f0;
  }

  .detail-item:last-child {
    border-bottom: none;
  }

  .detail-label {
    font-size: 13px;
    color: #8c8c8c;
  }

  .detail-value {
    font-size: 14px;
    color: #262626;
    font-weight: 500;
  }

  .stock-value {
    padding: 4px 12px;
    background: #f6ffed;
    color: #52c41a;
    border-radius: 12px;
    font-size: 13px;
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
    padding: 12px;
    border-radius: 12px;
    margin-top: auto;
  }

  .price-label {
    font-size: 12px;
    color: #8c8c8c;
    margin-bottom: 4px;
  }

  .price-value {
    font-size: 20px;
    font-weight: 700;
    color: #1890ff;
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .currency {
    font-size: 14px;
    font-weight: 500;
    color: #595959;
  }

  /* Card Footer */
  .card-footer {
    padding: 12px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    background: #fafafa;
    border-top: 1px solid #f0f0f0;
  }

  .view-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 36px;
    border-radius: 8px;
    font-weight: 500;
    border: 1px solid #d9d9d9;
    transition: all 0.3s;
    font-size: 14px;
  }

  .view-btn:hover {
    border-color: #1890ff;
    color: #1890ff;
    transform: translateY(-2px);
  }

  .cart-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 36px;
    border-radius: 8px;
    font-weight: 500;
    background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
    border: none;
    transition: all 0.3s;
    font-size: 14px;
  }

  .cart-btn:hover {
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
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
  }

  @media (max-width: 768px) {
    .medicines-container {
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

    .cards-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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

    .medicine-name {
      font-size: 16px;
      min-height: auto;
    }

    .price-value {
      font-size: 20px;
    }

    .card-footer {
      grid-template-columns: 1fr;
    }
  }
</style>

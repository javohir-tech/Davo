<template>
  <div class="branches-container">
    <div class="branches-wrapper">
      <!-- Header -->
      <div class="header-section">
        <Title :level="2" class="page-title">
          <span class="header-icon">🏥</span>
          Bizning Filiallar
        </Title>
        <p class="header-subtitle">
          Toshkent bo'ylab {{ filials.length }} ta zamonaviy tibbiyot markazimiz
          sizning xizmatizda
        </p>
      </div>

      <!-- Qidiruv -->
      <div class="search-section">
        <Input
          v-model:value="searchText"
          placeholder="Sizga qulay bo'lgan manzilni kiriting..."
          size="large"
          allow-clear
          @pressEnter="handleSearch"
          class="search-input"
        >
          <template #prefix>
            <SearchOutlined class="search-icon" />
          </template>
        </Input>
        <div v-if="searchText" class="filial-count">
          <p>{{ filteredBranches.length }} ta element topildi</p>
        </div>
      </div>

      <!-- Filiallar grid -->
      <Row :gutter="[24, 24]" class="branches-grid">
        <Col
          v-for="branch in paginatedBranches"
          :key="branch.id"
          :xs="24"
          :sm="12"
          :lg="8"
        >
          <Card hoverable class="branch-card" @click="showModal(branch)">
            <template #cover>
              <div class="card-image-wrapper">
                <img
                  :alt="branch.name"
                  :src="branch.image"
                  class="card-image"
                />
                <div class="rating-badge">⭐ {{ branch.rating }}</div>
              </div>
            </template>

            <CardMeta>
              <template #title>
                <div class="card-title">{{ branch.name }}</div>
              </template>
              <template #description>
                <Space direction="vertical" size="small" class="card-content">
                  <div class="info-row">
                    <EnvironmentOutlined class="icon icon-location" />
                    <span class="info-text">{{ branch.address }}</span>
                  </div>
                  <div class="info-row">
                    <PhoneOutlined class="icon icon-phone" />
                    <span class="info-text info-text-bold">{{
                      branch.phone
                    }}</span>
                  </div>
                  <div class="info-row">
                    <ClockCircleOutlined class="icon icon-clock" />
                    <span class="info-text">{{ branch.workTime }}</span>
                  </div>
                  <div class="card-footer">
                    <span class="doctors-count">
                      👨‍⚕️ {{ branch.doctors }} shifokor
                    </span>
                    <a-tag color="blue">Batafsil</a-tag>
                  </div>
                </Space>
              </template>
            </CardMeta>
          </Card>
        </Col>
      </Row>

      <!-- Agar natija topilmasa -->
      <div v-if="filteredBranches.length === 0" class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3 class="no-results-title">Filial topilmadi</h3>
        <p class="no-results-text">Boshqa so'z bilan qidirib ko'ring</p>
      </div>

      <!-- Pagination -->
      <div v-if="filteredBranches.length > pageSize" class="pagination-wrapper">
        <Pagination
          v-model:current="currentPage"
          :total="filteredBranches.length"
          :page-size="pageSize"
          :show-size-changer="false"
          @change="handlePageChange"
          :show-total="
            (total, range) => `${range[0]}-${range[1]} / ${total} ta filial`
          "
        />
      </div>

      <!-- Modal - Batafsil ma'lumot -->
      <Modal
        v-model:open="isModalVisible"
        :footer="null"
        :width="700"
        :style="{ top: '20px' }"
      >
        <div v-if="selectedBranch" class="modal-content">
          <img
            :src="selectedBranch.image"
            :alt="selectedBranch.name"
            class="modal-image"
          />

          <div class="modal-header">
            <h2 class="modal-title">{{ selectedBranch.name }}</h2>
            <a-tag color="gold" class="modal-rating">
              ⭐ {{ selectedBranch.rating }}
            </a-tag>
          </div>

          <p class="modal-description">{{ selectedBranch.description }}</p>

          <Space direction="vertical" size="middle" class="modal-info">
            <div class="modal-info-row">
              <EnvironmentOutlined class="modal-icon icon-location" />
              <div>
                <div class="modal-info-label">Manzil:</div>
                <div class="modal-info-value">{{ selectedBranch.address }}</div>
              </div>
            </div>

            <div class="modal-info-row">
              <PhoneOutlined class="modal-icon icon-phone" />
              <div>
                <div class="modal-info-label">Telefon:</div>
                <div class="modal-info-value">{{ selectedBranch.phone }}</div>
              </div>
            </div>

            <div class="modal-info-row">
              <ClockCircleOutlined class="modal-icon icon-clock" />
              <div>
                <div class="modal-info-label">Ish vaqti:</div>
                <div class="modal-info-value">
                  {{ selectedBranch.workTime }}
                </div>
              </div>
            </div>
          </Space>

          <div class="services-section">
            <div class="services-title">Xizmatlar:</div>
            <div class="services-tags">
              <a-tag
                v-for="(service, index) in selectedBranch.services"
                :key="index"
                color="blue"
                class="service-tag"
              >
                {{ service }}
              </a-tag>
            </div>
          </div>

          <div class="stats-section">
            <div class="stat-item">
              <div class="stat-value">{{ selectedBranch.doctors }}</div>
              <div class="stat-label">Malakali shifokor</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ selectedBranch.rating }}</div>
              <div class="stat-label">Reyting</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  //Antd
  import {
    SearchOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    ClockCircleOutlined,
  } from '@ant-design/icons-vue'
  import {
    Typography,
    Row,
    Col,
    Card,
    CardMeta,
    Space,
    Modal,
    Input,
    Pagination,
  } from 'ant-design-vue'

  //Import Filials
  import filials from '@/Data/filials.json'

  const { Title } = Typography
  const searchText = ref('')
  const currentPage = ref(1)
  const selectedBranch = ref(null)
  const isModalVisible = ref(false)
  const pageSize = 6

  // Computed
  const filteredBranches = computed(() => {
    return filials.filter(
      (branch) =>
        branch.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchText.value.toLowerCase())
    )
  })

  const paginatedBranches = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return filteredBranches.value.slice(start, end)
  })

  // Methods
  const showModal = (branch) => {
    selectedBranch.value = branch
    isModalVisible.value = true
  }

  const handleSearch = (value) => {
    currentPage.value = 1
  }

  const handlePageChange = (page) => {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReload = () => {
    window.location.reload()
  }

  watch(searchText, () => {
    currentPage.value = 1
  })
</script>

<style scoped>
  .branches-container {
    min-height: 100vh;
    background: #f5f7fa;
    padding: 40px 20px;
  }

  .branches-wrapper {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Header */
  .header-section,
  .search-section {
    padding: 32px;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border-radius: 15px;
    margin-bottom: 16px;
  }

  .page-title {
    margin: 0 !important;
    display: flex;
    align-items: center;
    font-size: 1.8rem;
    font-weight: 700;
    gap: 12px;
    color: #667eea;
  }

  .header-icon {
    font-size: 32px;
  }

  .header-subtitle {
    margin: 8px 10px 0px 48px;
    color: #8c8c8c;
    font-size: 14px;
  }

  /* Qidiruv */

  .search-icon {
    color: #1890ff;
    font-size: 18px;
  }

  .search-input {
    max-width: 500px;
  }

  .filial-count {
    p {
      font-size: 14px;
      margin-top: 10px;
      margin-bottom: 0;
      font-weight: 500;
      color: #52c41a;
    }
  }

  /* Grid */
  .branches-grid {
    margin-bottom: 40px;
  }

  /* Karta */
  .branch-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid #f0f0f0;
    height: 100%;
  }

  .branch-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .card-image-wrapper {
    height: 220px;
    overflow: hidden;
    position: relative;
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .branch-card:hover .card-image {
    transform: scale(1.05);
  }

  .rating-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 255, 255, 0.95);
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 14px;
    color: #1890ff;
  }

  .card-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #262626;
  }

  .card-content {
    width: 100%;
  }

  .info-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .icon {
    margin-top: 4px;
    font-size: 16px;
  }

  .icon-location {
    color: #1890ff;
  }

  .icon-phone {
    color: #52c41a;
  }

  .icon-clock {
    color: #fa8c16;
  }

  .info-text {
    color: #595959;
    font-size: 14px;
  }

  .info-text-bold {
    font-weight: 500;
  }

  .card-footer {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .doctors-count {
    color: #8c8c8c;
    font-size: 13px;
  }

  /* No results */
  .no-results {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .no-results-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .no-results-title {
    color: #595959;
    margin-bottom: 8px;
  }

  .no-results-text {
    color: #8c8c8c;
  }

  /* Pagination */
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* Modal */
  .modal-content {
    padding: 0;
  }

  .modal-image {
    width: 100%;
    height: 280px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 24px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .modal-title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }

  .modal-rating {
    font-size: 16px;
    padding: 4px 12px;
    margin: 0;
  }

  .modal-description {
    color: #595959;
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .modal-info {
    width: 100%;
    margin-bottom: 24px;
  }

  .modal-info-row {
    display: flex;
    gap: 12px;
  }

  .modal-icon {
    font-size: 20px;
    margin-top: 2px;
  }

  .modal-info-label {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .modal-info-value {
    color: #595959;
  }

  .services-section {
    background: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .services-title {
    font-weight: 600;
    margin-bottom: 12px;
    font-size: 16px;
  }

  .services-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .service-tag {
    margin: 0;
    padding: 4px 12px;
  }

  .stats-section {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    color: white;
  }

  .stat-item {
    text-align: center;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
  }

  .stat-label {
    opacity: 0.9;
    margin-top: 4px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .branches-container {
      padding: 20px 12px;
    }

    .header-section {
      padding: 30px 20px;
    }

    .search-input {
      max-width: 500px;
    }

    .modal-header {
      flex-direction: column;
      gap: 12px;
    }

    .modal-rating {
      align-self: flex-start;
    }
  }

  @media (max-width: 576px) {
    .search-input {
      max-width: 100%;
    }
  }
</style>

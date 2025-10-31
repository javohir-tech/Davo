<template>
  <div class="services-container">
    <div class="services-page">
      <!-- Header -->
      <div class="header">
        <Title :level="2">
          <span class="header-icon">
            <UserOutlined />
          </span>
          Xizmatlar
        </Title>
        <p class="header-subtitle">
          Biz sizga yugori darajada xizmatlarni taklif qilamiz
        </p>
      </div>

      <!-- Search Section -->
      <div class="header">
        <Input
          ref="searchInput"
          v-model:value="search"
          size="large"
          placeholder="Xizmatni qidiring..."
          allow-clear
          @pressEnter="onSearchEnter"
          style="max-width: 360px; width: 100%"
          class="input-search"
        >
          <template #prefix>
            <SearchOutlined class="search-icon" />
          </template>
          <template #suffix>
            <p class="ctrl">Ctrl+K</p>
          </template>
        </Input>
        <div v-if="search" class="filtered-count">
          <p>{{ filteredServices.length }} ta xizmat topildi</p>
        </div>
      </div>

      <!-- Servicies -->
      <Row :gutter="[16, 16]" class="cards-row">
        <Col
          v-for="service in paginatedServices"
          :key="service.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
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
              <p class="service-desc">
                {{ truncate(service.description, 100) }}
              </p>
              <div class="card-meta">
                <Tag :color="getLevelColor(service.level)">
                  {{ service.level }}
                </Tag>
                <span class="doctors-count">
                  <TeamOutlined style="margin-right: 5px" />
                  {{ loading ? ' ' : countDoctors(service.specialty) }} doktor
                </span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <!-- Pagination -->
      <div class="pagination-wrap">
        <Pagination
          v-model:current="currentPage"
          :page-size="pageSize"
          :total="filteredServices.length"
          @change="onPageChange"
          :show-size-changer="paginatedServices.length >= 10"
        />
      </div>

      <!-- Xizmat modal -->
      <Modal
        v-model:open="modalVisible"
        :title="selectedService?.title"
        :width="720"
        @cancel="closeModal"
        :footer="null"
        destroyOnClose
      >
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

          <div v-if="loading" class="loading-spin">
            <Spin />
          </div>

          <div
            v-else-if="matchedDoctors.length && !loading"
            class="doctors-list"
          >
            <List
              :data-source="matchedDoctors"
              :grid="{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }"
            >
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
                        <ClockCircleOutlined
                          style="color: #667eea; margin-right: 5px"
                        />
                        <strong>Tajriba:</strong> {{ item.experience }} yil
                      </p>
                      <p>
                        <CalendarOutlined
                          style="color: #667eea; margin-right: 5px"
                        />
                        <strong>Ish kunlari:</strong> {{ item.workDays }}
                      </p>
                      <p>
                        <DollarOutlined
                          style="color: #667eea; margin-right: 5px"
                        />
                        <strong>Konsultatsiya:</strong>
                        {{ formatMoney(item.consultationFee) }}
                      </p>
                      <p>
                        <BankOutlined
                          style="color: #667eea; margin-right: 5px"
                        />
                        <strong>Ta'lim:</strong> {{ item.education }}
                      </p>
                    </div>

                    <Button
                      type="primary"
                      block
                      @click="onSelectDoctor(item.id)"
                      style="margin-top: 10px"
                    >
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
  import { ref, computed, onMounted, toRaw, watch, onBeforeUnmount } from 'vue'
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
    Pagination,
    Spin,
  } from 'ant-design-vue'
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
  } from '@ant-design/icons-vue'

  import { useRouter } from 'vue-router'

  //Hooks
  import useDocs from '@/Hooks/useDocs'
  //Local Data
  // --- Xizmatlar massiv ---
  import services from '@/Data/services.json'

  const { data, loading, getData } = useDocs('doctors')

  const { Title } = Typography

  const router = useRouter()

  // --- Reactive state ---
  const search = ref('')
  const searchInput = ref(null)
  const currentPage = ref(1)
  const pageSize = 6
  const modalVisible = ref(false)
  const selectedService = ref(null)

  // --- Computed ---
  const filteredServices = computed(() => {
    const q = String(search.value || '')
      .trim()
      .toLowerCase()
    if (!q) return services
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        s.specialty.toLowerCase().includes(q)
    )
  })

  const handleShortcut = (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      searchInput.value?.focus()
    }
  }

  const paginatedServices = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredServices.value.slice(start, start + pageSize)
  })

  const matchedDoctors = computed(() => {
    if (!selectedService.value) return []
    const spec = normalizeSpecialty(selectedService.value.specialty)
    return data.value.filter((d) => normalizeSpecialty(d.specialty) === spec)
  })

  // --- Methods ---
  function truncate(text, len = 80) {
    if (!text) return ''
    return text.length > len ? text.slice(0, len) + '...' : text
  }

  function countDoctors(specialty) {
    return data.value.filter(
      (d) => normalizeSpecialty(d.specialty) === normalizeSpecialty(specialty)
    ).length
  }

  function normalizeSpecialty(str) {
    if (!str) return ''
    return String(str).toLowerCase().replace(/\s+/g, '')
  }

  function getLevelColor(level) {
    const colors = {
      Advanced: 'green',
      Standard: 'blue',
      Special: 'purple',
    }
    return colors[level] || 'default'
  }

  function formatMoney(amount) {
    return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm"
  }

  function openModal(service) {
    selectedService.value = service
    modalVisible.value = true
  }

  function closeModal() {
    modalVisible.value = false
    selectedService.value = null
  }

  function onSelectDoctor(doctorId) {
    router.push(`doctors/${doctorId}`)
  }

  function onPageChange(page) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function onSearchEnter() {
    currentPage.value = 1
  }

  watch(search, () => {
    currentPage.value = 1
  })

  onMounted(() => {
    window.addEventListener('keydown', handleShortcut)
    getData()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleShortcut)
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
    color: #1890ff;
  }

  .header-icon {
    font-size: 32px;
  }

  .header-subtitle {
    margin: 8px 0px 0px 42px;
    color: #8c8c8c;
    font-size: 14px;
  }

  .input-search {
    max-width: 500px;
  }

  .search-icon {
    color: #1890ff;
    font-size: 18px;
  }

  .filtered-count {
    p {
      font-size: 14px;
      margin-top: 10px;
      margin-bottom: 0;
      font-weight: 500;
      color: #52c41a;
    }
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

  .loading-spin {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
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

  @media (max-width: 576px) {
    .header-subtitle {
      margin-left: 36px;
      font-size: 12px;
    }
  }
</style>

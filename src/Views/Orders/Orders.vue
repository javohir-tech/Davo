<template>
  <div class="orders-container">
    <div class="page-header">
      <h1 class="page-title">Buyurtmalar</h1>
      <a-space :size="[8, 8]" wrap class="header-actions">
        <a-select
          v-model:value="filterStatus"
          style="min-width: 140px"
          placeholder="Status"
          @change="loadOrders"
        >
          <a-select-option value="all">Hammasi</a-select-option>
          <a-select-option value="pending">Kutilmoqda</a-select-option>
          <a-select-option value="completed">Bajarilgan</a-select-option>
          <a-select-option value="cancelled">Bekor qilingan</a-select-option>
        </a-select>

        <a-button type="primary" @click="loadOrders" :loading="loading">
          <ReloadOutlined />
          <span class="btn-text">Yangilash</span>
        </a-button>
      </a-space>
    </div>

    <a-spin :spinning="loading" size="large">
      <a-empty
        v-if="orders.length === 0 && !loading"
        description="Hali buyurtmalar yo'q"
        :image="'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'"
      >
        <RouterLink to="/drugs">
          <a-button type="primary" size="large"> Buyurtma berish </a-button>
        </RouterLink>
      </a-empty>

      <div v-else class="orders-grid">
        <div
          v-for="item in paginatedOrders"
          :key="item.id"
          class="order-card-wrapper"
        >
          <div :class="['order-card', `status-${item.status || 'pending'}`]">
            <!-- Header -->
            <div class="card-header">
              <div class="order-id-wrapper">
                <span class="order-label">ID:</span>
                <span class="order-id">{{ item.id.slice(-8) }}</span>
              </div>
              <a-tag :color="getStatusColor(item.status)" class="status-tag">
                {{ getStatusText(item.status) }}
              </a-tag>
            </div>

            <!-- Date & Time -->
            <div class="info-row">
              <ClockCircleOutlined class="info-icon" />
              <span class="info-text">{{ formatDate(item.vaqt) }}</span>
            </div>

            <!-- Address -->
            <div class="info-row">
              <EnvironmentOutlined class="info-icon" />
              <span class="info-text">{{
                item.yetkazibBerishMalumotlari.manzil
              }}</span>
            </div>

            <!-- Phone -->
            <div class="info-row">
              <PhoneOutlined class="info-icon" />
              <span class="info-text">{{
                item.yetkazibBerishMalumotlari.telefonRaqami
              }}</span>
            </div>

            <!-- Delivery Time -->
            <div class="info-row delivery-time">
              <span class="info-label">Yetkazish:</span>
              <span class="info-value">{{
                item.yetkazibBerishMalumotlari.yetkazibBerishVaqti
              }}</span>
            </div>

            <a-divider style="margin: 16px 0" />

            <!-- Drugs -->
            <div class="drugs-section">
              <h4 class="section-title">
                <MedicineBoxOutlined />
                Dorilar ({{ item.dorilar.length }})
              </h4>
              <div class="drugs-list">
                <div
                  v-for="(drug, index) in item.dorilar"
                  :key="index"
                  class="drug-item"
                >
                  <div class="drug-main">
                    <span class="drug-name">{{ drug.nomi }}</span>
                    <a-tag v-if="drug.retseptKerak" color="orange" size="small">
                      Retsept
                    </a-tag>
                  </div>
                  <div class="drug-quantity">
                    <span class="quantity">{{ drug.soni }} ta</span>
                    <span class="price">{{ formatPrice(drug.narxi) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Doctor Code -->
            <div v-if="item.shifokorKodi" class="doctor-code">
              <UserOutlined />
              <span
                >Shifokor: <strong>{{ item.shifokorKodi }}</strong></span
              >
            </div>

            <a-divider style="margin: 16px 0" />

            <!-- Price Summary -->
            <div class="price-section">
              <div class="price-row">
                <span>Dorilar:</span>
                <span>{{ formatPrice(item.narxlar.jamiSumma) }}</span>
              </div>
              <div class="price-row">
                <span>Yetkazish:</span>
                <span>{{ formatPrice(item.narxlar.yetkazibBerishNarxi) }}</span>
              </div>
              <div class="price-row total">
                <span>Jami:</span>
                <span class="total-price">{{
                  formatPrice(item.narxlar.umumiySumma)
                }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="card-actions">
              <a-button
                type="primary"
                ghost
                block
                @click="showOrderDetails(item)"
              >
                <EyeOutlined /> Batafsil
              </a-button>
              <a-button danger ghost block @click="orderOpenModel">
                <DeleteOutlined /> Bekor qilish
              </a-button>
              <!-- delete modal -->
              <a-modal
                v-model:open="deleteOrderVisible"
                title="Buyurtmani Bekor qilish"
                @ok="deleteOrder(item.id)"
              >
                <p>Buyurtmalarni rostan ham bekor qilmoqchimisiz?</p>
              </a-modal>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="orders.length > 0" class="pagination-wrapper">
        <a-pagination
          v-model:current="currentPage"
          v-model:page-size="pageSize"
          :total="orders.length"
          :show-size-changer="true"
          :show-total="(total) => `Jami: ${total} ta`"
          :page-size-options="['6', '12', '24', '48']"
          @change="handlePageChange"
          @showSizeChange="handlePageChange"
        />
      </div>
    </a-spin>

    <!-- Details Modal -->
    <a-modal
      v-model:open="detailsModalVisible"
      title="Buyurtma Tafsilotlari"
      width="800px"
      :footer="null"
      centered
    >
      <div v-if="selectedOrder" class="modal-content">
        <a-descriptions
          bordered
          :column="{ xs: 1, sm: 1, md: 2 }"
          size="middle"
        >
          <a-descriptions-item label="ID" :span="2">
            <a-typography-text copyable>{{
              selectedOrder.id
            }}</a-typography-text>
          </a-descriptions-item>
          <a-descriptions-item label="Status">
            <a-tag :color="getStatusColor(selectedOrder.status)">
              {{ getStatusText(selectedOrder.status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Vaqt">
            {{ formatDate(selectedOrder.vaqt) }}
          </a-descriptions-item>
          <a-descriptions-item label="Manzil" :span="2">
            {{ selectedOrder.yetkazibBerishMalumotlari.manzil }}
          </a-descriptions-item>
          <a-descriptions-item label="Telefon">
            {{ selectedOrder.yetkazibBerishMalumotlari.telefonRaqami }}
          </a-descriptions-item>
          <a-descriptions-item label="Yetkazish vaqti">
            {{ selectedOrder.yetkazibBerishMalumotlari.yetkazibBerishVaqti }}
          </a-descriptions-item>
          <a-descriptions-item
            v-if="selectedOrder.shifokorKodi"
            label="Shifokor kodi"
            :span="2"
          >
            {{ selectedOrder.shifokorKodi }}
          </a-descriptions-item>
        </a-descriptions>

        <a-divider orientation="left">
          <MedicineBoxOutlined /> Dorilar
        </a-divider>

        <a-table
          :columns="drugColumns"
          :data-source="selectedOrder.dorilar"
          :pagination="false"
          size="small"
          :scroll="{ x: 500 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'narxi'">
              {{ formatPrice(record.narxi) }}
            </template>
            <template v-if="column.key === 'jami'">
              <strong>{{ formatPrice(record.narxi * record.soni) }}</strong>
            </template>
            <template v-if="column.key === 'retseptKerak'">
              <a-tag
                :color="record.retseptKerak ? 'orange' : 'green'"
                size="small"
              >
                {{ record.retseptKerak ? 'Ha' : "Yo'q" }}
              </a-tag>
            </template>
          </template>
        </a-table>

        <div class="modal-summary">
          <a-divider />
          <div class="summary-row">
            <span>Dorilar:</span>
            <span>{{ formatPrice(selectedOrder.narxlar.jamiSumma) }}</span>
          </div>
          <div class="summary-row">
            <span>Yetkazib berish:</span>
            <span>{{
              formatPrice(selectedOrder.narxlar.yetkazibBerishNarxi)
            }}</span>
          </div>
          <div class="summary-row total">
            <span>Umumiy summa:</span>
            <span class="total-amount">{{
              formatPrice(selectedOrder.narxlar.umumiySumma)
            }}</span>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
  } from 'firebase/firestore'
  import { db } from '@/FireBase/config'
  import { message, Modal } from 'ant-design-vue'
  import {
    ReloadOutlined,
    EyeOutlined,
    DeleteOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MedicineBoxOutlined,
    UserOutlined,
    ExclamationCircleOutlined,
  } from '@ant-design/icons-vue'

  const orders = ref([])
  const loading = ref(false)
  const filterStatus = ref('all')
  const currentPage = ref(1)
  const pageSize = ref(6)
  const detailsModalVisible = ref(false)
  const deleteOrderVisible = ref(false)
  const selectedOrder = ref(null)

  const drugColumns = [
    { title: 'Dori nomi', dataIndex: 'nomi', key: 'nomi', width: 200 },
    {
      title: 'Soni',
      dataIndex: 'soni',
      key: 'soni',
      align: 'center',
      width: 80,
    },
    {
      title: 'Narxi',
      dataIndex: 'narxi',
      key: 'narxi',
      align: 'right',
      width: 120,
    },
    { title: 'Jami', key: 'jami', align: 'right', width: 120 },
    {
      title: 'Retsept',
      dataIndex: 'retseptKerak',
      key: 'retseptKerak',
      align: 'center',
      width: 100,
    },
  ]

  const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return orders.value.slice(start, end)
  })

  const loadOrders = async () => {
    loading.value = true
    try {
      const ordersQuery = query(
        collection(db, 'Orders'),
        orderBy('vaqt', 'desc')
      )
      const querySnapshot = await getDocs(ordersQuery)

      orders.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      if (filterStatus.value !== 'all') {
        orders.value = orders.value.filter(
          (order) => (order.status || 'pending') === filterStatus.value
        )
      }

      message.success(`${orders.value.length} ta buyurtma yuklandi`)
    } catch (error) {
      console.error('Buyurtmalarni yuklashda xato:', error)
      message.error('Buyurtmalarni yuklashda xatolik yuz berdi')
    } finally {
      loading.value = false
    }
  }

  const orderOpenModel = () => {
    deleteOrderVisible.value = true
  }

  const deleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, 'Orders', orderId))
      orders.value = orders.value.filter((order) => order.id !== orderId)
      message.success('Buyurtma bekor qilindi')
    } catch (error) {
      console.error("Buyurtmani o'chirishda xato:", error)
      message.error("Buyurtmani o'chirishda xatolik yuz berdi")
    } finally {
      deleteOrderVisible.value = false
    }
  }

  const showOrderDetails = (order) => {
    selectedOrder.value = order
    detailsModalVisible.value = true
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm"
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('uz-UZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      completed: 'green',
      cancelled: 'red',
    }
    return colors[status] || 'orange'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Kutilmoqda',
      completed: 'Bajarilgan',
      cancelled: 'Bekor qilingan',
    }
    return texts[status] || 'Kutilmoqda'
  }

  const handlePageChange = (page, size) => {
    currentPage.value = page
    pageSize.value = size
  }

  onMounted(() => {
    loadOrders()
  })
</script>

<style scoped>
  .orders-container {
    min-height: 100vh;
    background: #f5f7fa;
    padding: 20px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;
    background: white;
    padding: 20px 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .page-title {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
    color: #1a1a1a;
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }

  .btn-text {
    margin-left: 6px;
  }

  /* Orders Grid */
  .orders-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }

  .order-card-wrapper {
    height: 100%;
  }

  .order-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .order-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }

  /* Card Header */
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
  }

  .order-id-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .order-label {
    font-size: 13px;
    color: #8c8c8c;
    font-weight: 500;
  }

  .order-id {
    font-family: 'Courier New', monospace;
    font-weight: 700;
    font-size: 16px;
    color: #1890ff;
    background: #e6f7ff;
    padding: 4px 10px;
    border-radius: 6px;
  }

  .status-tag {
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
  }

  /* Info Rows */
  .info-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
    color: #262626;
  }

  .info-icon {
    font-size: 16px;
    color: #1890ff;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .info-text {
    font-size: 14px;
    line-height: 1.6;
    word-break: break-word;
  }

  .delivery-time {
    background: #f0f5ff;
    padding: 8px 12px;
    border-radius: 8px;
    margin-top: 4px;
  }

  .info-label {
    font-weight: 600;
    color: #595959;
    font-size: 13px;
  }

  .info-value {
    color: #1890ff;
    font-weight: 500;
    font-size: 13px;
  }

  /* Drugs Section */
  .drugs-section {
    flex: 1;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 12px;
  }

  .drugs-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .drug-item {
    background: #fafafa;
    padding: 10px 12px;
    border-radius: 8px;
    border-left: 3px solid #1890ff;
  }

  .drug-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 6px;
  }

  .drug-name {
    font-weight: 500;
    color: #262626;
    font-size: 14px;
    flex: 1;
  }

  .drug-quantity {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: #595959;
  }

  .quantity {
    font-weight: 500;
  }

  .price {
    color: #1890ff;
    font-weight: 600;
  }

  /* Doctor Code */
  .doctor-code {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff7e6;
    border: 1px solid #ffd591;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 13px;
    color: #ad6800;
    margin-top: 12px;
  }

  /* Price Section */
  .price-section {
    background: #fafafa;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .price-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 14px;
    color: #595959;
  }

  .price-row.total {
    border-top: 2px solid #d9d9d9;
    margin-top: 8px;
    padding-top: 12px;
    font-weight: 700;
    font-size: 16px;
    color: #262626;
  }

  .total-price {
    color: #52c41a;
    font-size: 20px;
  }

  /* Card Actions */
  .card-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: auto;
  }

  /* Pagination */
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    padding: 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  /* Modal */
  .modal-content {
    max-height: 70vh;
    overflow-y: auto;
  }

  .modal-summary {
    margin-top: 20px;
    background: #fafafa;
    padding: 16px;
    border-radius: 8px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 15px;
    color: #595959;
  }

  .summary-row.total {
    border-top: 2px solid #d9d9d9;
    margin-top: 12px;
    padding-top: 16px;
    font-weight: 700;
    font-size: 18px;
    color: #262626;
  }

  .total-amount {
    color: #52c41a;
    font-size: 24px;
  }

  /* Responsive Design */
  @media (max-width: 1200px) {
    .orders-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .orders-container {
      padding: 12px;
    }

    .page-header {
      flex-direction: column;
      align-items: stretch;
      padding: 16px;
    }

    .page-title {
      font-size: 24px;
      text-align: center;
    }

    .header-actions {
      justify-content: center;
    }

    .orders-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .order-card {
      padding: 16px;
    }

    .card-actions {
      grid-template-columns: 1fr;
    }

    .btn-text {
      display: none;
    }

    .drug-item {
      padding: 8px 10px;
    }

    .drug-main {
      flex-direction: column;
      align-items: flex-start;
    }

    .price-row.total {
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .total-price {
      font-size: 24px;
    }
  }

  @media (max-width: 576px) {
    .page-title {
      font-size: 20px;
    }

    .order-id {
      font-size: 14px;
      padding: 3px 8px;
    }

    .card-header {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }

    .order-id-wrapper {
      justify-content: center;
    }

    .status-tag {
      text-align: center;
    }

    :deep(.ant-pagination) {
      text-align: center;
    }

    :deep(.ant-pagination-options) {
      display: none;
    }
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .order-card {
    animation: fadeIn 0.3s ease-out;
  }

  /* Custom Scrollbar */
  .modal-content::-webkit-scrollbar {
    width: 6px;
  }

  .modal-content::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 3px;
  }

  .modal-content::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 3px;
  }

  .modal-content::-webkit-scrollbar-thumb:hover {
    background: #8c8c8c;
  }
</style>

<template>
  <div class="medicines-container">
    <div class="header-section">
      <Title :level="2" class="page-title">
        <span class="title-icon">💊</span>
        Dorilar
      </Title>
      <p class="subtitle">Barcha dorilar ro'yxati va ma'lumotlari</p>
    </div>

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

    <!-- Dorilar jadvali -->
    <div class="table-section">
      <Table :columns="columns" :data-source="filteredMedicines" :pagination="{
        current: currentPage,
        pageSize: pageSize,
        total: filteredMedicines.length,
        showSizeChanger: true,
        showTotal: (total) => `Jami: ${total} ta dori`
      }" :scroll="{ x: 'max-content' }" :loading="false" rowKey="id" class="medicines-table"
        @change="(pagination) => currentPage = pagination.current">
        <template #bodyCell="{ column, record }">
          <!-- Dori nomi ustuni -->
          <template v-if="column.key === 'name'">
            <a @click="viewMedicine(record.id)" class="medicine-name">
              {{ record.name }}
            </a>
          </template>

          <!-- Narx ustuni -->
          <template v-else-if="column.key === 'price'">
            <span class="price-tag">{{ record.price.toLocaleString() }} so'm</span>
          </template>

          <!-- Ombor ustuni -->
          <template v-else-if="column.key === 'stock'">
            <span :class="['stock-badge', record.stock < 100 ? 'low-stock' : '']">
              {{ record.stock }} ta
            </span>
          </template>

          <!-- Amallar ustuni -->
          <template v-else-if="column.key === 'actions'">
            <!-- Desktop: Tugmalar -->
            <Space :size="8" class="desktop-actions">
              <Button type="link" size="small" @click="viewMedicine(record.id)" class="action-btn">
                <EyeOutlined />
                <span class="btn-text">Batafsil</span>
              </Button>
              <Button type="primary" size="small" @click="addToCart(record)" class="cart-btn">
                <ShoppingCartOutlined />
                <span class="btn-text">Savat</span>
              </Button>
            </Space>

            <!-- Mobile: Dropdown Menu -->
            <Dropdown class="mobile-actions" :trigger="['click']">
              <Button type="text" size="small" class="more-btn">
                <MoreOutlined style="font-size: 20px;" />
              </Button>
              <template #overlay>
                <Menu>
                  <MenuItem key="view" @click="viewMedicine(record.id)">
                  <EyeOutlined /> Batafsil ko'rish
                  </MenuItem>
                  <MenuItem key="cart" @click="addToCart(record)">
                  <ShoppingCartOutlined /> Savatga qo'shish
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

<script setup>
import { ref, computed, onMounted } from 'vue';
//Antd Components
import { Table, Input, Button, Space, Typography, Dropdown, Menu } from 'ant-design-vue';
//Antd Icons
import { SearchOutlined, ShoppingCartOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons-vue';
//FireStore
import { collection, getDocs, query } from "firebase/firestore";
import { db } from '@/FireBase/config';

const { Title } = Typography;

// Mock dorilar ma'lumotlari
const mockMedicines = [
  { id: 1, name: 'Paracetamol', category: 'Og\'riq qoldiruvchi', price: 5000, manufacturer: 'PharmaCorp', stock: 150 },
  { id: 2, name: 'Ibuprofen', category: 'Yallig\'lanishga qarshi', price: 8000, manufacturer: 'HealthMed', stock: 200 },
  { id: 3, name: 'Amoxicillin', category: 'Antibiotik', price: 12000, manufacturer: 'MediPlus', stock: 80 },
  { id: 4, name: 'Aspirin', category: 'Og\'riq qoldiruvchi', price: 4500, manufacturer: 'PharmaCorp', stock: 300 },
  { id: 5, name: 'Omeprazol', category: 'Oshqozon dori', price: 15000, manufacturer: 'GastroMed', stock: 120 },
  { id: 6, name: 'Ciprofloxacin', category: 'Antibiotik', price: 18000, manufacturer: 'BioPharm', stock: 90 },
  { id: 7, name: 'Metformin', category: 'Qandli diabet', price: 20000, manufacturer: 'DiabetCare', stock: 110 },
  { id: 8, name: 'Atorvastatin', category: 'Yurak-qon tomir', price: 25000, manufacturer: 'CardioHealth', stock: 75 },
  { id: 9, name: 'Cetirizine', category: 'Allergiya', price: 7000, manufacturer: 'AllergyFree', stock: 180 },
  { id: 10, name: 'Lisinopril', category: 'Bosim dori', price: 16000, manufacturer: 'CardioHealth', stock: 95 },
  { id: 11, name: 'Salbutamol', category: 'Nafas yo\'llari', price: 22000, manufacturer: 'RespiroCare', stock: 60 },
  { id: 12, name: 'Dexamethasone', category: 'Gormon dori', price: 13000, manufacturer: 'HormonMed', stock: 140 },
  { id: 13, name: 'Vitamin D3', category: 'Vitamin', price: 9000, manufacturer: 'VitaHealth', stock: 250 },
  { id: 14, name: 'Losartan', category: 'Bosim dori', price: 17000, manufacturer: 'CardioHealth', stock: 85 },
  { id: 15, name: 'Azithromycin', category: 'Antibiotik', price: 19000, manufacturer: 'BioPharm', stock: 70 },
  { id: 16, name: 'Diclofenac', category: 'Yallig\'lanishga qarshi', price: 11000, manufacturer: 'PainRelief', stock: 160 },
  { id: 17, name: 'Simvastatin', category: 'Yurak-qon tomir', price: 21000, manufacturer: 'CardioHealth', stock: 100 },
  { id: 18, name: 'Ranitidine', category: 'Oshqozon dori', price: 10000, manufacturer: 'GastroMed', stock: 130 },
  { id: 19, name: 'Amlodipine', category: 'Bosim dori', price: 14000, manufacturer: 'CardioHealth', stock: 105 },
  { id: 20, name: 'Prednisolone', category: 'Gormon dori', price: 12500, manufacturer: 'HormonMed', stock: 115 },
];

const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// Qidiruv funksiyasi
const filteredMedicines = computed(() => {
  if (!searchQuery.value) {
    return mockMedicines;
  }
  return mockMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Jadval ustunlari
const columns = [
  {
    title: 'Dori nomi',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Kategoriya',
    dataIndex: 'category',
    key: 'category',
    responsive: ['md']
  },
  {
    title: 'Narxi',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Ishlab chiqaruvchi',
    dataIndex: 'manufacturer',
    key: 'manufacturer',
    responsive: ['lg']
  },
  {
    title: 'Omborda',
    dataIndex: 'stock',
    key: 'stock',
    responsive: ['sm']
  },
  {
    title: 'Amallar',
    key: 'actions',
    align: 'center',
  }
];

// Dori sahifasiga o'tish
const viewMedicine = (medicineId) => {
  console.log(`Dori sahifasiga o'tish: /medicines/${medicineId}`);
  // Router push qilish uchun:
  // router.push({ name: 'MedicineDetail', params: { id: medicineId } });
  alert(`Dori #${medicineId} sahifasiga o'tiladi (router keyinchalik qo'shiladi)`);
};

// Savatga qo'shish
const addToCart = (medicine) => {
  console.log('Savatga qo\'shildi:', medicine);
  // State management orqali savatga qo'shish:
  // store.dispatch('cart/addItem', medicine);
  alert(`${medicine.name} savatga qo'shildi!`);
};

const getDocuments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "drugs"));
    querySnapshot.forEach((query) => {
      console.log(query.data())
    })
  } catch (error) {
    console.log(error.message)
  }
}

onMounted(() => {
  getDocuments()
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

/* Jadval bo'limi */
.table-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.medicines-table :deep(.ant-table) {
  font-size: 14px;
}

.medicines-table :deep(.ant-table-thead > tr > th) {
  background: #fafafa;
  font-weight: 600;
  color: #262626;
  border-bottom: 2px solid #f0f0f0;
}

.medicines-table :deep(.ant-table-tbody > tr:hover) {
  background: #f5f9ff;
}

/* Dori nomi */
.medicine-name {
  color: #1890ff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

.medicine-name:hover {
  color: #40a9ff;
  text-decoration: underline;
}

/* Narx tagi */
.price-tag {
  color: #52c41a;
  font-weight: 600;
  font-size: 14px;
}

/* Ombor badge */
.stock-badge {
  padding: 4px 12px;
  background: #f6ffed;
  color: #52c41a;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #b7eb8f;
}

.stock-badge.low-stock {
  background: #fff7e6;
  color: #fa8c16;
  border-color: #ffd591;
}

/* Amallar tugmalari */
.desktop-actions {
  display: inline-flex;
  gap: 4px;
}

.mobile-actions {
  display: none;
}

.action-btn {
  padding: 4px 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

.cart-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #52c41a;
  border-color: #52c41a;
  padding: 4px 10px;
  font-size: 13px;
}

.cart-btn:hover {
  background: #73d13d;
  border-color: #73d13d;
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

/* Desktop: default tugmalar */
@media (min-width: 769px) {
  .mobile-actions {
    display: none !important;
  }

  .desktop-actions {
    display: inline-flex !important;
  }
}

/* Responsive */
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
  .desktop-actions {
    display: none !important;
  }

  .mobile-actions {
    display: inline-block !important;
  }

  .medicines-table :deep(.ant-table) {
    font-size: 13px;
  }

  /* Jadval ustunlarini optimizatsiya */
  .medicines-table :deep(.ant-table-cell) {
    padding: 12px 8px;
  }

  /* Dori nomi ustuni */
  .medicines-table :deep(.ant-table-cell:first-child) {
    min-width: 150px;
    max-width: 200px;
  }

  /* Amallar ustuni */
  .medicines-table :deep(.ant-table-cell:last-child) {
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
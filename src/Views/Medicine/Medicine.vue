<template>
  <div class="medicine-detail-page">
    <!-- Header -->
    <div class="header-section">
      <a-typography-title :level="2" style="margin: 0; color: #1890ff;">
        <medicine-box-outlined /> Dori Ma'lumotlari
      </a-typography-title>
    </div>


    <!-- Asosiy Kontent -->
    <div v-if="loading && !dataById" class='medicine-loading'>
      <a-spin size="large" />
    </div>
    <div v-else-if="!loading && !dataById" style="text-align: center; margin-top: 100px;">
      <a-empty />
      <a-button type="primary">
        <RouterLink to="/drugs">
          Dorilar
        </RouterLink>
      </a-button>
    </div>
    <div v-else-if="!loading && dataById">
      <div class="main-content">
        <!-- Chap tomon - Asosiy ma'lumotlar -->
        <a-card class="medicine-card">
          <template #title>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <span>{{ dataById.name }}</span>
              <a-tag v-if="dataById.prescriptionRequired" color="red">
                <file-protect-outlined /> Retsept kerak
              </a-tag>
            </div>
          </template>

          <a-space direction="vertical" size="large" style="width: 100%;">
            <div>
              <a-tag color="blue">{{ dataById.category }}</a-tag>
              <a-tag color="green">Mavjud: {{ dataById.stock }} dona</a-tag>
            </div>

            <div>
              <a-typography-title :level="3" style="color: #52c41a; margin: 0;">
                {{ formatPrice(dataById.price) }} so'm
              </a-typography-title>
              <a-typography-text v-if="drugStore.isSelected(dataById.id)" type="secondary"
                style="display: block; margin-top: 4px;">
                Jami: {{ formatPrice(dataById.price * drugStore.getQuantity(dataById.id)) }} so'm
              </a-typography-text>
            </div>

            <div v-if="!drugStore.isSelected(dataById.id)">
              <a-button type="primary" size="large" block @click="drugStore.addDrug(dataById)">
                <shopping-cart-outlined /> Savatga qo'shish
              </a-button>
            </div>

            <div v-else style="display: flex; align-items: center; gap: 12px;">
              <a-button size="large" @click="drugStore.decrementQuantity(dataById.id)" :icon="h(MinusOutlined)" />
              <a-typography-text strong style="font-size: 18px; min-width: 40px; text-align: center;">
                {{ drugStore.getQuantity(dataById.id) }}
              </a-typography-text>
              <a-button size="large" type="primary" @click="drugStore.incrementQuantity(dataById.id)"
                :icon="h(PlusOutlined)" />
            </div>

            <div>
              <a-typography-text type="secondary">Ishlab chiqaruvchi:</a-typography-text>
              <br>
              <a-typography-text strong>{{ dataById.manufacturer }}</a-typography-text>
              <a-tag style="margin-left: 8px;">{{ dataById.country }}</a-tag>
            </div>

            <div>
              <a-typography-paragraph>{{ dataById.description }}</a-typography-paragraph>
            </div>

            <a-divider />

            <a-descriptions :column="{ xs: 1, sm: 1, md: 1 }" bordered size="small">
              <a-descriptions-item label="Faol modda">
                {{ dataById.activeIngredient }}
              </a-descriptions-item>
              <a-descriptions-item label="Dozalash">
                {{ dataById.dosage }}
              </a-descriptions-item>
              <a-descriptions-item label="Saqlash sharoiti">
                {{ dataById.storageConditions }}
              </a-descriptions-item>
              <a-descriptions-item label="Yaroqlilik muddati">
                {{ dataById.expiryDate }}
              </a-descriptions-item>
            </a-descriptions>
            <div>
              <a-typography-text strong>Sertifikatlar:</a-typography-text>
              <br>
              <a-space wrap style="margin-top: 8px;">
                <a-tag v-for="cert in dataById.certifications" :key="cert" color="blue">
                  <safety-certificate-outlined /> {{ cert }}
                </a-tag>
              </a-space>
            </div>
          </a-space>
        </a-card>

        <a-space direction="vertical" size="middle" style="width: 100%;">
          <!-- Qo'llanish ko'rsatmalari -->
          <a-card title="💊 Qo'llanish ko'rsatmalari" size="small">
            <a-typography-paragraph>
              {{ dataById.usageInstructions }}
            </a-typography-paragraph>
          </a-card>

          <!-- Indikatsiyalar -->
          <a-card size="small">
            <template #title>
              <check-circle-outlined style="color: #52c41a;" /> Indikatsiyalar
            </template>
            <a-space direction="vertical" size="small">
              <div v-for="(item, index) in dataById.indications" :key="index">
                <check-circle-outlined style="color: #52c41a;" /> {{ item }}
              </div>
            </a-space>
          </a-card>

          <!-- Kontrendikatsiyalar -->
          <a-card size="small">
            <template #title>
              <close-circle-outlined style="color: #ff4d4f;" /> Kontrendikatsiyalar
            </template>
            <a-space direction="vertical" size="small">
              <div v-for="(item, index) in dataById.contraindications" :key="index">
                <close-circle-outlined style="color: #ff4d4f;" /> {{ item }}
              </div>
            </a-space>
          </a-card>

          <!-- Nojo'ya ta'sirlar -->
          <a-card size="small">
            <template #title>
              <info-circle-outlined style="color: #faad14;" /> Nojo'ya ta'sirlar
            </template>
            <a-space direction="vertical" size="small">
              <div v-for="(item, index) in dataById.sideEffects" :key="index">
                <info-circle-outlined style="color: #faad14;" /> {{ item }}
              </div>
            </a-space>
          </a-card>

          <!-- Ogohlantirish -->
          <a-alert :message="dataById.WarningMessage" type="warning" show-icon>
            <template #icon>
              <warning-outlined />
            </template>
          </a-alert>
        </a-space>
      </div>
    </div>

  </div>
</template>

<script setup>
import { h, onMounted } from 'vue';
import {
  ShoppingCartOutlined,
  MedicineBoxOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  MinusOutlined,
  FileProtectOutlined
} from '@ant-design/icons-vue';

// Hooks
import useDocs from '@/Hooks/useDocs';
const { dataById, loading, getDocumentById } = useDocs('medicines')
//Route
import { useRoute } from 'vue-router';
const route = useRoute()
//Store
import { useDrugsStore } from '@/Store/useDrugsStore';
const drugStore = useDrugsStore();

const formatPrice = (price) => {
  return price
};


onMounted(() => {
  getDocumentById(route.params.id);
})
</script>

<style scoped>
.medicine-detail-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.medicine-loading {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.medicine-card {
  height: fit-content;
}

@media (max-width: 992px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .medicine-detail-page {
    padding: 10px;
  }
}
</style>
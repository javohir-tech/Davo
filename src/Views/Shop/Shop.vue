<template>
  <div style="background: #f0f2f5;">
    <div class="cart-page">
      <a-card class="cart-header" :bordered="false">
        <template #title>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div class="header-content">
              <shopping-cart-outlined class="cart-icon" />
              <span class="title">Savat</span>
              <a-badge :count="drugStore.selectedCount" :number-style="{ backgroundColor: '#52c41a' }" />
            </div>
            <RouterLink to="/orders">
              <a-button type="primary">
                Buyurtmalar
              </a-button>
            </RouterLink>
          </div>
        </template>
      </a-card>

      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :lg="16">
          <a-card :bordered="false" class="cart-items">
            <div class="loading-selecteds" v-if="drugStore.loadingSelecteds && drugStore.selectedDrugs.length === 0">
              <a-spin size="large" />
            </div>
            <a-empty v-if="!drugStore.loadingSelecteds && drugStore.selectedDrugs.length === 0"
              description="Savat bo'sh">
              <RouterLink to="/drugs">
                <a-button type="primary">
                  Xaridni boshlash
                </a-button>
              </RouterLink>
            </a-empty>
            <div v-for="item in drugStore.selectedDrugs" :key="item.id" class="cart-item">
              <a-row :gutter="16" align="middle">
                <a-col :xs="24" :sm="6" :md="4">
                  <div class="item-image">
                    <medicine-box-outlined class="medicine-icon" />
                  </div>
                </a-col>

                <a-col :xs="24" :sm="10" :md="12">
                  <div class="item-details">
                    <h3 class="item-name">{{ item.name }}</h3>
                    <p class="item-manufacturer">
                      <shop-outlined /> {{ item.manufacturer }}
                    </p>
                    <a-tag color="blue">{{ item.dosage }}</a-tag>
                    <a-tag :color="item.prescriptionRequired ? 'red' : 'green'">
                      {{ item.prescriptionRequired ? 'Retsept kerak' : 'Retseptsiz' }}
                    </a-tag>
                    <a-tag color="default">{{ item.country }}</a-tag>
                  </div>
                </a-col>

                <a-col :xs="12" :sm="4" :md="4">
                  <div class="quantity-control">
                    <a-button size="small" @click="drugStore.decrementQuantity(item.id)"
                      :disabled="drugStore.getQuantity(item.id) <= 1">
                      <minus-outlined />
                    </a-button>
                    <span class="quantity">{{ drugStore.getQuantity(item.id) }}</span>
                    <a-button size="small" @click="drugStore.incrementQuantity(item.id)">
                      <plus-outlined />
                    </a-button>
                  </div>
                </a-col>

                <a-col :xs="12" :sm="4" :md="4">
                  <div class="item-actions">
                    <div class="item-price">{{ formatPrice(drugStore.getQuantity(item.id) * item.price) }} so'm</div>
                    <a-button type="text" danger @click="drugStore.removeDrug(item.id)" class="remove-btn">
                      <delete-outlined /> O'chirish
                    </a-button>
                  </div>
                </a-col>
              </a-row>
              <a-button type="text" style="margin-top: 10px;" block>
                <RouterLink :to="`/drugs/${item.id}`">
                  <EyeOutlined /> Batafsil
                </RouterLink>
              </a-button>
            </div>
          </a-card>
          <a-button v-if="drugStore.selectedCount > 0" size="large" type="primary" danger block
            style="margin-top: 10px;" @click="showModal">
            Savatni Tozalash
          </a-button>
          <a-modal v-model:open="open" title="Savatni tozalash" @ok="handleOk">
            <p>Siz haqiqatan ham savatingizni tozalamoqchimisiz?</p>
          </a-modal>
        </a-col>

        <a-col :xs="24" :lg="8">
          <a-card :bordered="false" class="summary-card">
            <template #title>
              <calculator-outlined /> Jami hisob
            </template>

            <div class="summary-row">
              <span>Mahsulotlar soni:</span>
              <span class="summary-value">{{ drugStore.selectedCount }} ta</span>
            </div>

            <div class="summary-row">
              <span>Jami summa:</span>
              <span class="summary-value">{{ formatPrice(totalPrice) }} so'm</span>
            </div>

            <a-divider />

            <div class="summary-row total">
              <span>To'lov summasi:</span>
              <span class="summary-total">{{ formatPrice(totalPrice) }} so'm</span>
            </div>

            <a-alert v-if="hasRxItems" message="Diqqat!"
              description="Savatingizda retsept talab qilinadigan dorilar bor. Buyurtma berishda retsept taqdim etishingiz kerak."
              type="warning" show-icon class="rx-warning" />

            <a-button @click="openOrderModal" type="primary" size="large" block class="checkout-btn"
              :disabled="drugStore.selectedDrugs.length === 0">
              <credit-card-outlined /> Buyurtma berish
            </a-button>

            <!-- YANGI BUYURTMA MODAL -->
            <a-modal v-model:open="isOrderModalOpen" title="Buyurtmani Tasdiqlash" width="600px"
              @cancel="closeOrderModal">
              <template #footer>
                <a-button @click="closeOrderModal">Bekor qilish</a-button>
                <a-button type="primary" @click="handleConfirmOrder" :disabled="!isFormValid || loading">
                  {{ loading ? 'Yuklanmoqda...' : 'Buyurtmani Tasdiqlash' }}
                </a-button>
              </template>

              <a-form layout="vertical">
                <!-- Manzil -->
                <a-form-item label="Yetkazib berish manzili Hozirda faqat Toshkent shahriga buyutmalar qabul qilamiz"
                  required>
                  <a-input v-model:value="address" placeholder="Manzilni kiriting" size="large" />
                </a-form-item>

                <!-- Telefon raqami -->
                <a-form-item label="Telefon raqami" required>
                  <a-input v-model:value="phoneNumber" placeholder="+998 90 123 45 67" size="large" type="tel" />
                </a-form-item>

                <!-- Yetkazib berish vaqti -->
                <a-form-item label="Yetkazib berish vaqti" required>
                  <a-select v-model:value="deliveryTime" placeholder="Yetkazib berish vaqtini tanlang" size="large"
                    :options="deliveryOptions" />
                </a-form-item>

                <!-- Shifokor kodi (faqat retsept kerak bo'lsa) -->
                <a-form-item v-if="hasRxItems" label="Retsept kodi" required>
                  <a-input v-model:value="doctorCode" placeholder="Retseptli dorilar uchun shifokor kodini kiriting"
                    size="large" />
                  <span style="color: #faad14; font-size: 12px;">
                    ⚠️ Agar savatingizda retsept talab qilinadigan dorilar bo'lsa, shifokorlarimiz sizga bergan kodni
                    kiritishingiz kerak.
                  </span>
                </a-form-item>

                <!-- Buyurtma ma'lumotlari -->
                <a-divider>Buyurtma Tafsilotlari</a-divider>

                <div class="order-items">
                  <div v-for="drug in drugStore.selectedDrugs" :key="drug.id" class="order-item">
                    <div class="item-info">
                      <span class="item-name-modal">
                        {{ drug.name }}
                        <span v-if="drug.prescriptionRequired" class="prescription-badge">
                          Retsept
                        </span>
                      </span>
                      <span class="item-quantity-modal">Soni: {{ drug.quantity }}</span>
                    </div>
                    <span class="item-price-modal">
                      {{ formatPrice(drug.price * drug.quantity) }} so'm
                    </span>
                  </div>
                </div>

                <!-- Narxlar hisob-kitobi -->
                <div class="price-breakdown">
                  <div class="price-row-modal">
                    <span>Jami summa:</span>
                    <span>{{ formatPrice(subtotal) }} so'm</span>
                  </div>
                  <div class="price-row-modal">
                    <span>Yetkazib berish:</span>
                    <span :class="{ 'free-delivery': deliveryFee === 0 }">
                      {{ deliveryFee === 0 ? 'BEPUL' : formatPrice(deliveryFee) + ' so\'m' }}
                    </span>
                  </div>
                  <a-divider style="margin: 12px 0;" />
                  <div class="price-row-modal total-row-modal">
                    <span><strong>Umumiy summa:</strong></span>
                    <span><strong>{{ formatPrice(total) }} so'm</strong></span>
                  </div>
                </div>

                <div v-if="subtotal < FREE_DELIVERY_THRESHOLD" class="delivery-info">
                  ℹ️ Bepul yetkazib berish uchun yana {{ formatPrice(FREE_DELIVERY_THRESHOLD - subtotal) }} so'm
                  qo'shing
                </div>
              </a-form>
            </a-modal>

            <RouterLink to="/drugs">
              <a-button v-if="drugStore.selectedCount > 0" size="large" block class="continue-btn">
                Xaridni davom ettirish
              </a-button>
            </RouterLink>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  ShoppingCartOutlined,
  MedicineBoxOutlined,
  ShopOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  CalculatorOutlined,
  CreditCardOutlined,
  EyeOutlined
} from '@ant-design/icons-vue';

//Drugs store
import { useDrugsStore } from '@/Store/useDrugsStore';

//user store
import { useUsersStore } from '@/Store/useUserStore';
//firebase
import { db } from '@/FireBase/config';
import { setDoc, doc } from 'firebase/firestore';
import { message } from 'ant-design-vue';

const userStore = useUsersStore();

const drugStore = useDrugsStore();
const open = ref(false);

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_ORDERS_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_ORDERS_TELEGRAM_CHAT_ID;
const TELEGRAM_BOT_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

// Buyurtma modal uchun yangi ref'lar
const isOrderModalOpen = ref(false);
const address = ref('');
const phoneNumber = ref('');
const deliveryTime = ref('');
const doctorCode = ref('');
const loading = ref(false);

// Konstantalar
const DELIVERY_FEE = 25000;
const FREE_DELIVERY_THRESHOLD = 100000;

// Yetkazib berish variantlari
const deliveryOptions = [
  { value: '1 kun', label: '1 kun' },
  { value: '2 kun', label: '2 kun' },
  { value: '3 kun', label: '3 kun' }
];

const totalPrice = computed(() => {
  return drugStore.selectedDrugs.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const hasRxItems = computed(() => {
  return drugStore.selectedDrugs.some(item => item.prescriptionRequired);
});

// Buyurtma modal uchun hisob-kitoblar
const subtotal = computed(() => {
  return drugStore.selectedDrugs.reduce((sum, drug) => {
    return sum + (drug.price * drug.quantity);
  }, 0);
});

const deliveryFee = computed(() => {
  return subtotal.value < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
});

const total = computed(() => {
  return subtotal.value + deliveryFee.value;
});

const isFormValid = computed(() => {
  const basicFieldsValid = address.value && phoneNumber.value && deliveryTime.value;
  if (hasRxItems.value) {
    return basicFieldsValid && doctorCode.value === import.meta.env.VITE_LOCAL_RETSEPT_KEY;
  }
  return basicFieldsValid;
});

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const showModal = () => {
  open.value = true;
};

const openOrderModal = () => {
  isOrderModalOpen.value = true;
};

const closeOrderModal = () => {
  isOrderModalOpen.value = false;
};

const handleOk = () => {
  drugStore.clearList();
  open.value = false;
};

const handleConfirmOrder = async () => {
  loading.value = true;
  try {
    if (!isFormValid.value) {
      return;
    }

    const orderData = {
      dorilar: drugStore.selectedDrugs.map(drug => ({
        id: drug.id,
        nomi: drug.name,
        narxi: drug.price,
        soni: drug.quantity,
        retseptKerak: drug.prescriptionRequired
      })),
      yetkazibBerishMalumotlari: {
        manzil: address.value,
        telefonRaqami: phoneNumber.value,
        yetkazibBerishVaqti: deliveryTime.value
      },
      narxlar: {
        jamiSumma: subtotal.value,
        yetkazibBerishNarxi: deliveryFee.value,
        umumiySumma: total.value
      },
      shifokorKodi: hasRxItems.value ? doctorCode.value : null,
      vaqt: new Date().toISOString()
    };

    const messageText = `
  Yangi Buyurtma Malumotlari:
  ${orderData.dorilar.map(drug => (`
    dori nomi : ${drug.nomi} | dori soni: ${drug.soni} | dori narxi :${formatPrice(drug.narxi)} 
  `)).join('\n')}
  Yetkazish manzili: ${orderData.yetkazibBerishMalumotlari.manzil}
  Telefon raqami: ${orderData.yetkazibBerishMalumotlari.telefonRaqami}
  Yetkazib berish vaqti: ${orderData.yetkazibBerishMalumotlari.yetkazibBerishVaqti}
  Jami summa: ${formatPrice(orderData.narxlar.umumiySumma)} so'm
  YetkazibBerishNarxi : ${formatPrice(orderData.narxlar.yetkazibBerishNarxi)} so'm
  Umumiy summa: ${formatPrice(orderData.narxlar.umumiySumma)} so'm
  Telefon : ${orderData.yetkazibBerishMalumotlari.telefonRaqami}
  Vaqt :${new Date().toLocaleString('uz-UZ')}
  `

    await setDoc(doc(db, 'Orders', `${userStore.uid}_${new Date().getTime()}`), orderData);
    
    fetch(TELEGRAM_BOT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      bodyody: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: messageText,
      }),
    }).then(response => {
      if (!response.ok) {
        throw new Error('Telegram xabar yuborishda xatolik yuz berdi');
      }
      return response.json();
    })
    // Formani tozalash
    address.value = '';
    phoneNumber.value = '';
    deliveryTime.value = undefined;
    doctorCode.value = '';
    drugStore.clearList();
    message.success('Buyurtma muvaffaqiyatli yaratildi!');
  } catch (error) {
    console.error('Buyurtma yaratishda xato:', error);
  } finally {
    loading.value = false;
    closeOrderModal();
  }

};

onMounted(() => {
  drugStore.fetchSelectedDrugs();
});
</script>

<style scoped>
.loading-selecteds {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
}

.cart-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
}

.cart-header {
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cart-icon {
  font-size: 24px;
  color: #1890ff;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
}

.cart-items {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.cart-item {
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.medicine-icon {
  font-size: 40px;
  color: white;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-name {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0;
}

.item-manufacturer {
  color: #8c8c8c;
  margin: 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

.quantity {
  font-size: 18px;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.item-price {
  font-size: 18px;
  font-weight: 600;
  color: #52c41a;
}

.remove-btn {
  font-size: 12px;
}

.summary-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 15px;
}

.summary-value {
  font-weight: 600;
  color: #262626;
}

.summary-row.total {
  font-size: 18px;
  font-weight: 600;
}

.summary-total {
  color: #52c41a;
  font-size: 22px;
}

.rx-warning {
  margin: 16px 0;
}

.checkout-btn {
  margin-top: 16px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.continue-btn {
  margin-top: 12px;
  height: 48px;
  font-size: 16px;
}

/* Modal ichidagi stillar */
.order-items {
  margin: 16px 0;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 8px;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name-modal {
  font-weight: 500;
  color: #262626;
}

.item-quantity-modal {
  font-size: 12px;
  color: #8c8c8c;
}

.item-price-modal {
  font-weight: 600;
  color: #1890ff;
}

.prescription-badge {
  display: inline-block;
  background: #faad14;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
  font-weight: bold;
}

.price-breakdown {
  margin-top: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.price-row-modal {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.total-row-modal {
  font-size: 16px;
  color: #1890ff;
  margin-bottom: 0;
}

.free-delivery {
  color: #52c41a;
  font-weight: 600;
}

.delivery-info {
  margin-top: 12px;
  padding: 8px 12px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  font-size: 12px;
  color: #0050b3;
}

@media (max-width: 768px) {
  .cart-page {
    padding: 12px;
  }

  .cart-item {
    padding: 16px;
  }

  .item-image {
    width: 60px;
    height: 60px;
    margin: 0 auto;
  }

  .medicine-icon {
    font-size: 30px;
  }

  .item-name {
    font-size: 16px;
  }

  .item-details {
    margin-top: 12px;
  }

  .quantity-control {
    justify-content: flex-start;
    margin-top: 12px;
  }

  .item-actions {
    align-items: flex-start;
    margin-top: 12px;
  }

  .summary-card {
    position: static;
  }
}

@media (max-width: 576px) {
  .title {
    font-size: 20px;
  }

  .cart-icon {
    font-size: 20px;
  }

  .item-price {
    font-size: 16px;
  }

  .summary-total {
    font-size: 18px;
  }
}
</style>
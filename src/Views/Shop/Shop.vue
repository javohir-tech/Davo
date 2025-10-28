<template>
  <div class="cart-page">
    <a-card class="cart-header" :bordered="false">
      <template #title>
        <div class="header-content">
          <shopping-cart-outlined class="cart-icon" />
          <span class="title">Savat</span>
          <a-badge :count="totalItems" :number-style="{ backgroundColor: '#52c41a' }" />
        </div>
      </template>
    </a-card>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="16">
        <a-card :bordered="false" class="cart-items">
          <a-empty v-if="cartItems.length === 0" description="Savat bo'sh" />
          
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
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
                  <a-button 
                    size="small" 
                    @click="decreaseQuantity(item.id)"
                    :disabled="item.quantity <= 1"
                  >
                    <minus-outlined />
                  </a-button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <a-button 
                    size="small" 
                    @click="increaseQuantity(item.id)"
                  >
                    <plus-outlined />
                  </a-button>
                </div>
              </a-col>

              <a-col :xs="12" :sm="4" :md="4">
                <div class="item-actions">
                  <div class="item-price">{{ formatPrice(item.price * item.quantity) }} so'm</div>
                  <a-button 
                    type="text" 
                    danger 
                    @click="removeItem(item.id)"
                    class="remove-btn"
                  >
                    <delete-outlined /> O'chirish
                  </a-button>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="8">
        <a-card :bordered="false" class="summary-card">
          <template #title>
            <calculator-outlined /> Jami hisob
          </template>

          <div class="summary-row">
            <span>Mahsulotlar soni:</span>
            <span class="summary-value">{{ totalItems }} ta</span>
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

          <a-alert
            v-if="hasRxItems"
            message="Diqqat!"
            description="Savatingizda retsept talab qilinadigan dorilar bor. Buyurtma berishda retsept taqdim etishingiz kerak."
            type="warning"
            show-icon
            class="rx-warning"
          />

          <a-button 
            type="primary" 
            size="large" 
            block 
            class="checkout-btn"
            :disabled="cartItems.length === 0"
          >
            <credit-card-outlined /> Buyurtma berish
          </a-button>

          <a-button 
            size="large" 
            block 
            class="continue-btn"
          >
            Xaridni davom ettirish
          </a-button>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import {
  ShoppingCartOutlined,
  MedicineBoxOutlined,
  ShopOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  CalculatorOutlined,
  CreditCardOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'CartPage',
  components: {
    ShoppingCartOutlined,
    MedicineBoxOutlined,
    ShopOutlined,
    PlusOutlined,
    MinusOutlined,
    DeleteOutlined,
    CalculatorOutlined,
    CreditCardOutlined
  },
  setup() {
    const cartItems = ref([
      {
        id: 2,
        name: "Amoxicillin",
        manufacturer: "PharmaCure",
        price: 15000,
        category: "Antibiotiklar",
        dosage: "500mg",
        quantity: 2,
        prescriptionRequired: true,
        country: "Turkiya"
      },
      {
        id: 5,
        name: "Paracetamol",
        manufacturer: "MedPharm",
        price: 8000,
        category: "Og'riq qoldiruvchilar",
        dosage: "500mg",
        quantity: 1,
        prescriptionRequired: false,
        country: "O'zbekiston"
      }
    ]);

    const totalItems = computed(() => {
      return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
    });

    const totalPrice = computed(() => {
      return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    });

    const hasRxItems = computed(() => {
      return cartItems.value.some(item => item.prescriptionRequired);
    });

    const formatPrice = (price) => {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const increaseQuantity = (id) => {
      const item = cartItems.value.find(item => item.id === id);
      if (item) {
        item.quantity++;
      }
    };

    const decreaseQuantity = (id) => {
      const item = cartItems.value.find(item => item.id === id);
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    };

    const removeItem = (id) => {
      cartItems.value = cartItems.value.filter(item => item.id !== id);
    };

    return {
      cartItems,
      totalItems,
      totalPrice,
      hasRxItems,
      formatPrice,
      increaseQuantity,
      decreaseQuantity,
      removeItem
    };
  }
};
</script>

<style scoped>
.cart-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f0f2f5;
  min-height: 100vh;
}

.cart-header {
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.cart-item {
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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
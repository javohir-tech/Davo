<script setup>
//Vue
import { ref } from 'vue'
//Antd icons
import {
  MenuOutlined,
  LoginOutlined,
  CloseOutlined,
  GlobalOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  ShoppingOutlined
} from '@ant-design/icons-vue'
//Route
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
//Menu Items
import menuItems from '@/Data/menuItems.json'
//user store
import { useUsersStore } from '@/Store/useUserStore'
//Drug store
import { useDrugsStore } from '@/Store/useDrugsStore'
//Dicebear
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

//store
const store = useUsersStore();
const drugStore = useDrugsStore();
const token = localStorage.getItem('token')
//Avatar
const profilImgURl = ref(null)
// State
const drawerVisible = ref(false)
//Select language
const value1 = ref('UZ')
//Router
const router = useRouter()
const route = useRoute()

//Select
const focus = () => {
  // console.log('focus');
}
const handleChangeLanguage = (value) => {
  // console.log(`selected ${value}`);
}

// Drawer header style
const drawerHeaderStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderBottom: 'none',
}

// Methods
const showDrawer = () => {
  drawerVisible.value = true
}

const handleMenuClick = () => {
  drawerVisible.value = false
}

const handleRouter = () => {
  drawerVisible.value = false
  router.push('/login')
}

const getAvatar = () => {
  const avatar = createAvatar(initials, {
    'seed': store.username
  })
  profilImgURl.value = avatar.toDataUri()

  return profilImgURl.value
}

const userChangePages = (path) => {
  router.push(path)
  drawerVisible.value= false
}

</script>

<template>
  <div>
    <a-layout-header class="navbar">
      <div class="navbar-container">
        <!-- Brand -->
        <div class="brand">
          <RouterLink to="/" class="brand-link">
            <img src="../../assets/wlogo.png" alt="DAVO.UZ" class="brand-logo" />
            <div class="brand-glow"></div>
          </RouterLink>
        </div>

        <!-- Desktop Menu -->
        <a-menu mode="horizontal" class="desktop-menu">
          <a-menu-item v-for="item in menuItems" :key="item.key" class="menu-item-custom">
            <RouterLink :to="item.path" :class="route.path === item.path ? 'activeLink' : ''">
              {{ item.label }}
              <span class="under-line"></span>
            </RouterLink>
          </a-menu-item>
        </a-menu>

        <!-- Desktop Actions -->
        <div class="desktop-actions">
          <a-space :size="12" align="center">
            <!-- Language Selector -->
            <div class="language-selector">
              <GlobalOutlined class="globe-icon" />
              <a-select v-model:value="value1" class="select-language" @focus="focus" @change="handleChangeLanguage">
                <a-select-option value="UZ">UZ</a-select-option>
                <a-select-option value="EN">EN</a-select-option>
                <a-select-option value="RU">RU</a-select-option>
              </a-select>
            </div>

            <!-- Login Button -->
            <a-badge :dot="drugStore.selectedCount > 0" v-if="store.token || token" type="primary">
              <a-dropdown @click.prevent>
                <img :src="store.photoURL ?? getAvatar()" style="width: 36px; border-radius: 100%;" alt="user img">
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="userChangePages('/profile')">
                      <UserOutlined /> Profile
                    </a-menu-item>
                    <a-menu-item @click="userChangePages('/shop')">
                      <a-badge :count="drugStore.selectedCount">
                        <ShoppingCartOutlined /> Savat
                      </a-badge>
                    </a-menu-item>
                    <a-menu-item @click="userChangePages('/orders')">
                      <ShoppingOutlined /> Buyurtmalar
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-badge>
            <a-button v-else type="primary" class="login-btn" @click="handleRouter">
              <template #icon>
                <LoginOutlined />
              </template>
              Kirish
            </a-button>
          </a-space>
        </div>

        <!-- Mobile Menu Button -->
        <a-button class="mobile-menu-btn" @click="showDrawer" type="text">
          <MenuOutlined class="menu-icon" />
        </a-button>
      </div>
    </a-layout-header>

    <!-- Mobile Drawer -->
    <a-drawer v-model:open="drawerVisible" title="DAVO.UZ" placement="right" :width="300"
      :headerStyle="drawerHeaderStyle" :bodyStyle="{ padding: 0, background: '#f9fafb' }" :closable="false">
      <template #extra>
        <a-space :size="12">
          <a-select v-model:value="value1" class="select-mobile" @focus="focus" @change="handleChangeLanguage"
            :bordered="false">
            <a-select-option value="UZ">🇺🇿 UZ</a-select-option>
            <a-select-option value="EN">🇬🇧 EN</a-select-option>
            <a-select-option value="RU">🇷🇺 RU</a-select-option>
          </a-select>
          <a-badge :dot="drugStore.selectedCount > 0" v-if="store.token || token" type="primary">
            <a-dropdown @click.prevent>
              <img :src="store.photoURL ?? getAvatar()" style="width: 36px; border-radius: 100%;" alt="user img">
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="userChangePages('/profile')">
                    <UserOutlined /> Profile
                  </a-menu-item>
                  <a-menu-item @click="userChangePages('/shop')">
                    <a-badge :count="drugStore.selectedCount">
                      <ShoppingCartOutlined /> Savat
                    </a-badge>
                  </a-menu-item>
                  <a-menu-item @click="userChangePages('/orders')">
                    <ShoppingOutlined /> Buyurtmalar
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-badge>
          <CloseOutlined @click="drawerVisible = false" class="close-icon" />
        </a-space>
      </template>
      <div class="drawer-content">
        <!-- Drawer Menu Items -->
        <div class="drawer-menu">
          <RouterLink v-for="item in menuItems" :key="item.key" :to="item.path" class="drawer-menu-item"
            :class="route.path === item.path ? 'active' : ''" @click="handleMenuClick">
            <span class="menu-item-dot"></span>
            {{ item.label }}
          </RouterLink>
        </div>

        <!-- Drawer Login Button -->
        <div class="drawer-footer" v-if="!store.token && !token">
          <a-button type="primary" block size="large" class="drawer-login-btn" @click="handleRouter">
            <template #icon>
              <LoginOutlined />
            </template>
            Kirish
          </a-button>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<style scoped>
/* ============================================ */
/* NAVBAR BASE STYLES */
/* ============================================ */
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0 32px;
  line-height: 70px;
  height: 70px;
  backdrop-filter: blur(10px);
  width: 100%;
  overflow: hidden;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  width: 100%;
  gap: 16px;
}

/* ============================================ */
/* BRAND LOGO */
/* ============================================ */
.brand {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}

.brand-link {
  display: block;
  position: relative;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.brand-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.brand-logo {
  width: 130px;
  height: auto;
  display: block;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
  transition: all 0.3s ease;
}

.brand-link:hover .brand-logo {
  filter: drop-shadow(0 4px 12px rgba(255, 255, 255, 0.3));
}

/* ============================================ */
/* DESKTOP MENU */
/* ============================================ */
.desktop-menu {
  flex: 1;
  margin: 0 24px;
  background: transparent;
  border: none;
  line-height: 70px;
  display: flex;
  justify-content: center;
  min-width: 0;
}

.desktop-menu :deep(.ant-menu-item) {
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  font-size: 15px;
  margin: 0 4px;
  padding: 0 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.desktop-menu :deep(.ant-menu-item:hover) {
  background: rgba(255, 255, 255, 0.15);
}

.desktop-menu :deep(.ant-menu-item) a {
  position: relative;
  display: inline-block;
  padding-bottom: 4px;
  color: inherit;
}

.desktop-menu :deep(.ant-menu-item) a:hover {
  color: #ffffff;
}

.under-line {
  height: 3px;
  background: linear-gradient(90deg,
      #ffffff 0%,
      rgba(255, 255, 255, 0.6) 100%);
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 0;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.4);
}

.desktop-menu :deep(.ant-menu-item) a:hover .under-line,
.activeLink .under-line {
  width: 100%;
}

.desktop-menu :deep(.ant-menu-item::after) {
  display: none;
}

/* ============================================ */
/* DESKTOP ACTIONS */
/* ============================================ */
.desktop-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* Language Selector */
.language-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 12px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.language-selector:hover {
  background: rgba(255, 255, 255, 0.25);
}

.globe-icon {
  color: white;
  font-size: 18px;
}

.select-language {
  width: 65px;
}

.select-language :deep(.ant-select-selector) {
  background: transparent !important;
  border: none !important;
  color: white !important;
  font-weight: 600;
  padding: 0 !important;
}

.select-language :deep(.ant-select-arrow) {
  color: white;
}

.select-language :deep(.ant-select-selection-item) {
  padding: 0 !important;
}

/* Login Button */
.login-btn {
  height: 40px;
  padding: 0 24px;
  font-weight: 600;
  font-size: 15px;
  border-radius: 10px;
  background: white;
  color: #667eea;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  background: #ffffff !important;
  color: #667eea !important;
}

/* ============================================ */
/* MOBILE MENU BUTTON */
/* ============================================ */
.mobile-menu-btn {
  display: none;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  padding: 10px;
  border-radius: 10px;
  height: 44px;
  width: 44px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.25) !important;
  transform: scale(1.05);
}

.menu-icon {
  font-size: 22px;
  color: white;
}

/* ============================================ */
/* DRAWER STYLES */
/* ============================================ */
.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f9fafb;
}

.drawer-menu {
  flex: 1;
  padding: 24px 0;
}

.drawer-menu-item {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
  position: relative;
}

.menu-item-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #cbd5e1;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.drawer-menu-item:hover {
  background: linear-gradient(90deg,
      rgba(102, 126, 234, 0.1) 0%,
      transparent 100%);
  color: #667eea;
  border-left-color: #667eea;
  padding-left: 28px;
}

.drawer-menu-item:hover .menu-item-dot {
  background: #667eea;
  transform: scale(1.3);
}

.drawer-menu-item.active {
  background: linear-gradient(90deg,
      rgba(102, 126, 234, 0.15) 0%,
      transparent 100%);
  color: #667eea;
  border-left-color: #667eea;
  font-weight: 600;
}

.drawer-menu-item.active .menu-item-dot {
  background: #667eea;
  transform: scale(1.3);
}

/* Drawer Footer */
.drawer-footer {
  padding: 24px;
  background: white;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
}

.drawer-login-btn {
  height: 50px;
  font-weight: 600;
  font-size: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.drawer-login-btn:hover {
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
}

/* Mobile Select */
.select-mobile {
  width: 90px;
}

.select-mobile :deep(.ant-select-selector) {
  background: rgba(255, 255, 255, 0.2) !important;
  border: none !important;
  color: white !important;
  font-weight: 600;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.select-mobile :deep(.ant-select-arrow) {
  color: white;
}

.close-icon {
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.close-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

/* ============================================ */
/* RESPONSIVE DESIGN */
/* ============================================ */

/* Planshet (768px - 1024px) */
@media (max-width: 1200px) {
  .navbar {
    padding: 0 24px;
  }

  .navbar-container {
    gap: 12px;
  }

  .desktop-menu {
    margin: 0 16px;
  }

  .desktop-menu :deep(.ant-menu-item) {
    font-size: 14px;
    margin: 0 2px;
    padding: 0 10px;
  }

  .desktop-actions {
    gap: 8px;
  }

  .login-btn {
    padding: 0 16px;
    font-size: 14px;
  }
}

@media (max-width: 992px) {
  .navbar {
    padding: 0 20px;
  }

  .desktop-menu,
  .desktop-actions {
    display: none !important;
  }

  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .brand-logo {
    width: 110px;
  }

  .navbar-container {
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 16px;
  }

  .brand-logo {
    width: 100px;
  }

  .brand-link {
    padding: 6px 12px;
  }
}

@media (max-width: 576px) {
  .navbar {
    padding: 0 12px;
    height: 64px;
    line-height: 64px;
  }

  .navbar-container {
    height: 64px;
  }

  .brand-logo {
    width: 90px;
  }

  .brand-link {
    padding: 4px 8px;
  }

  .mobile-menu-btn {
    height: 40px;
    width: 40px;
  }

  .menu-icon {
    font-size: 20px;
  }

  .drawer-footer {
    padding: 20px;
  }

  .drawer-login-btn {
    height: 48px;
    font-size: 15px;
  }
}

@media (max-width: 375px) {
  .navbar {
    padding: 0 8px;
  }

  .brand-logo {
    width: 80px;
  }

  .mobile-menu-btn {
    height: 36px;
    width: 36px;
  }
}

/* ============================================ */
/* ANIMATIONS */
/* ============================================ */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.drawer-menu-item {
  animation: slideIn 0.3s ease-out;
  animation-fill-mode: both;
}

.drawer-menu-item:nth-child(1) {
  animation-delay: 0.05s;
}

.drawer-menu-item:nth-child(2) {
  animation-delay: 0.1s;
}

.drawer-menu-item:nth-child(3) {
  animation-delay: 0.15s;
}

.drawer-menu-item:nth-child(4) {
  animation-delay: 0.2s;
}

.drawer-menu-item:nth-child(5) {
  animation-delay: 0.25s;
}

.drawer-menu-item:nth-child(6) {
  animation-delay: 0.3s;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}
</style>
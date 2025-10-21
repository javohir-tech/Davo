<template>
    <div>
        <a-layout-header class="navbar">
            <div class="navbar-container">
                <!-- Brand -->
                <div class="brand" @click="() => activeLink = '1'">
                    <RouterLink to="/">
                        <img src="../../assets/wlogo.png" alt="brand image">
                    </RouterLink>
                </div>

                <!-- Desktop Menu -->
                <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal" class="desktop-menu">
                    <a-menu-item v-for="item in menuItems" :key="item.key" @click="() => activeLink = item.key">
                        <RouterLink :to="item.path" :class="item.key === activeLink ? 'activeLink' : ''">
                            {{ item.label }}
                            <span class="under-line"></span>
                        </RouterLink>
                    </a-menu-item>
                </a-menu>

                <!-- Desktop Login Button -->
                <div style="display: flex; align-items: center;">
                    <a-space direction="horizontal">
                        <div class="search-btn">
                            <a-input-search v-model:value="value" placeholder="input search text"
                                style=" box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);" enter-button @search="onSearch" />
                        </div>
                        <a-select class="select-item-desktop" ref="select" v-model:value="value1"
                            style="width: 60px ; margin-right: 10px;" @focus="focus" @change="handleChangeLanguage">
                            <a-select-option value="uzb">UZ</a-select-option>
                            <a-select-option value="eng">EN</a-select-option>
                            <a-select-option value="rus">RU</a-select-option>
                        </a-select>
                    </a-space>
                    <a-button type="primary" class="login-btn desktop-login">
                        <template #icon>
                            <LoginOutlined />
                        </template>
                        Kirish
                    </a-button>
                </div>

                <!-- Mobile Menu Button -->
                <a-button class="mobile-menu-btn" @click="showDrawer" type="text">
                    <MenuOutlined style="font-size: 20px; color: white;" />
                </a-button>
            </div>
        </a-layout-header>

        <!-- Mobile Drawer -->
        <a-drawer v-model:open="drawerVisible" title="DAVO.UZ" placement="right" :width="280"
            :headerStyle="drawerHeaderStyle" :bodyStyle="{ padding: 0 }">
            <template #extra>
                <a-select class="select-item-mobile" ref="select" v-model:value="value1"
                    style="width: 70px ; margin-right: 10px;" @focus="focus" @change="handleChangeLanguage">
                    <a-select-option value="uzb">UZ</a-select-option>
                    <a-select-option value="eng">EN</a-select-option>
                    <a-select-option value="rus">RU</a-select-option>
                </a-select>
            </template>
            <div class="drawer-content">
                <!-- Drawer Menu Items -->
                <div class="drawer-menu">
                    <RouterLink v-for="item in menuItems" :key="item.key" :to="item.path" class="drawer-menu-item"
                        :class="item.key === activeLink ? 'active' : ''" @click="handleMenuClick(item.key)">
                        {{ item.label }}
                    </RouterLink>
                </div>

                <!-- Drawer Login Button -->
                <div class="drawer-footer">
                    <a-button type="primary" block size="large" class="drawer-login-btn">
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

<script setup>
import { ref, reactive } from 'vue';
import { MenuOutlined, LoginOutlined } from '@ant-design/icons-vue';

// State
const drawerVisible = ref(false);
const selectedKeys = ref(['1']);
const activeLink = ref('1');
//Select language
const value1 = ref('UZ');
//Search
const value = ref('')

// Menu items
const menuItems = [
    {
        key: '1',
        label: 'Bosh Sahifa',
        path: '/'
    },
    {
        key: '2',
        label: 'Dorila',
        path: "/drugs"
    },
    {
        key: '3',
        label: 'Shaxslar',
        path: "/doctors"
    },
    {
        key: '4',
        label: 'Muassasa',
        path: "/institution"
    },
    {
        key: '5',
        label: 'Xizmatlar',
        path: "/diagnostics"
    },
    {
        key: '6',
        label: 'Maqolalar',
        path: "/articls"
    },
    {
        key: '7',
        label: 'Intervyu',
        path: "/"
    },
];

//Select
const focus = () => {
    // console.log('focus');
};
const handleChangeLanguage = value => {
    // console.log(`selected ${value}`);
};

//Search
const onSearch = searchValue => {
    // console.log('use value', searchValue);
    // console.log('or use this.value', value.value);
};

// Drawer header style
const drawerHeaderStyle = {
    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
    color: 'white',
};

// Methods
const showDrawer = () => {
    drawerVisible.value = true;
};

const handleMenuClick = (key) => {
    selectedKeys.value = [key];
    drawerVisible.value = false;
    activeLink.value = key;
};
</script>

<style scoped>
.navbar {
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    position: sticky;
    top: 0;
    z-index: 1000;
    padding: 0 24px;
    line-height: 64px;
    height: 64px;
}

.navbar-container {
    max-width: 1220px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
}

.brand {
    color: white;
    font-size: 24px;
    font-weight: bold;
    padding: 10px;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: opacity 0.3s;
}

brand img {
    width: 124px;
}

.brand:hover {
    opacity: 0.8;
}

/* ========================================== */
/* ========================================== */
/* ========================================== */
/* ========================================== */
/* Desktop Menu Styles */
.desktop-menu {
    flex: 1;
    margin: 0 10px;
    background: transparent;
    border: none;
    line-height: 64px;
}

.desktop-menu :deep(.ant-menu-item) {
    color: white;
    font-weight: 500;
    margin: 0 4px;
    padding: 0 5px;
}

.desktop-menu :deep(.ant-menu-item) a {
    position: relative;
    padding-bottom: 10px;
}

.desktop-menu :deep(.ant-menu-item) a:hover {
    color: #D9EAFD;

    .under-line {
        width: 100%;
    }
}

.under-line {
    height: 2px;
    background-color: white;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    transition: all 0.3s ease-in;
}

.desktop-menu :deep(.ant-menu-item:hover),
.desktop-menu :deep(.ant-menu-item-selected) {
    color: white;
}

.activeLink {
    .under-line {
        width: 100%;
    }
}

.desktop-menu :deep(.ant-menu-item::after) {
    display: none;
}

/* Search Btn */
.search-btn {
    display: flex;
    align-items: center;
    margin-right: 10px;
}

/* Login Button */
.login-btn {
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.select-item-desktop {
    display: inline-block;
}

/* ==================================== */
/* ==================================== */
/* ==================================== */
/* ==================================== */
/* Mobile Menu Button */
.mobile-menu-btn {
    display: none;
    border: none;
    background: transparent;
    padding: 8px;
}

.mobile-menu-btn:hover {
    background: rgba(255, 255, 255, 0.2) !important;
}

/* Drawer Content */
.drawer-content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.drawer-menu {
    flex: 1;
    padding: 16px 0;
}

.drawer-menu-item {
    display: block;
    padding: 16px 24px;
    color: #333;
    text-decoration: none;
    font-weight: 500;
    border-left: 4px solid transparent;
    transition: all 0.3s;
}

.drawer-menu-item:hover {
    background: #e6f7ff;
    color: #1890ff;
    border-left-color: #1890ff;
}

.active {
    background: #e6f7ff;
    color: #1890ff;
    border-left-color: #1890ff;
}

.drawer-footer {
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
}

.drawer-login-btn {
    height: 44px;
    font-weight: 600;
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    border: none;
}

.drawer-login-btn:hover {
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
    transform: translateY(-2px);
}

/* Content */
.content {
    padding: 40px 24px;
    max-width: 1200px;
    margin: 0 auto;
}

.content h1 {
    font-size: 32px;
    margin-bottom: 16px;
    color: #333;
}

.content p {
    font-size: 16px;
    color: #666;
    line-height: 1.6;
}

/* Responsive */
@media (max-width: 992px) {

    .desktop-menu,
    .desktop-login {
        display: none !important;
    }

    .mobile-menu-btn {
        display: block;
    }

    .navbar-container {
        justify-content: space-between;
    }

    .brand img {
        width: 96px;
    }

    .search-btn {
        margin: 0 auto;
    }

    .select-item-desktop {
        display: none;
    }
}
</style>
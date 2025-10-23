<template>
    <div class="example" v-if="loading">
        <a-spin tip="Loading..." />
    </div>
    <div class="branches-container" v-else-if="!loading && filialsData.length !== 0">
        <div class="branches-wrapper">
            <!-- Header -->
            <div class="header-section">
                <h1 class="main-title">🏥 Bizning Filiallar</h1>
                <p class="subtitle">
                    Toshkent bo'ylab {{ filialsData.length }} ta zamonaviy tibbiyot markazimiz sizning xizmatizda
                </p>
            </div>

            <!-- Qidiruv -->
            <div class="search-section">
                <a-input-search v-model:value="searchText" placeholder="Filial nomi yoki manzili bo'yicha qidiring..."
                    size="large" allow-clear @search="handleSearch" class="search-input">
                    <template #enterButton>
                        <SearchOutlined />
                    </template>
                </a-input-search>
            </div>

            <!-- Natijalar soni -->
            <div v-if="searchText" class="results-count">
                <a-tag color="default" class="result-tag">
                    {{ filteredBranches.length }} ta filial topildi
                </a-tag>
            </div>

            <!-- Filiallar grid -->
            <a-row :gutter="[24, 24]" class="branches-grid">
                <a-col v-for="branch in paginatedBranches" :key="branch.id" :xs="24" :sm="12" :lg="8">
                    <a-card hoverable class="branch-card" @click="showModal(branch)">
                        <template #cover>
                            <div class="card-image-wrapper">
                                <img :alt="branch.name" :src="branch.image" class="card-image" />
                                <div class="rating-badge">
                                    ⭐ {{ branch.rating }}
                                </div>
                            </div>
                        </template>

                        <a-card-meta>
                            <template #title>
                                <div class="card-title">{{ branch.name }}</div>
                            </template>
                            <template #description>
                                <a-space direction="vertical" size="small" class="card-content">
                                    <div class="info-row">
                                        <EnvironmentOutlined class="icon icon-location" />
                                        <span class="info-text">{{ branch.address }}</span>
                                    </div>
                                    <div class="info-row">
                                        <PhoneOutlined class="icon icon-phone" />
                                        <span class="info-text info-text-bold">{{ branch.phone }}</span>
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
                                </a-space>
                            </template>
                        </a-card-meta>
                    </a-card>
                </a-col>
            </a-row>

            <!-- Agar natija topilmasa -->
            <div v-if="filteredBranches.length === 0" class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3 class="no-results-title">Filial topilmadi</h3>
                <p class="no-results-text">Boshqa so'z bilan qidirib ko'ring</p>
            </div>

            <!-- Pagination -->
            <div v-if="filteredBranches.length > pageSize" class="pagination-wrapper">
                <a-pagination v-model:current="currentPage" :total="filteredBranches.length" :page-size="pageSize"
                    :show-size-changer="false" @change="handlePageChange"
                    :show-total="(total, range) => `${range[0]}-${range[1]} / ${total} ta filial`" />
            </div>

            <!-- Modal - Batafsil ma'lumot -->
            <a-modal v-model:open="isModalVisible" :footer="null" :width="700" :style="{ top: '20px' }">
                <div v-if="selectedBranch" class="modal-content">
                    <img :src="selectedBranch.image" :alt="selectedBranch.name" class="modal-image" />

                    <div class="modal-header">
                        <h2 class="modal-title">{{ selectedBranch.name }}</h2>
                        <a-tag color="gold" class="modal-rating">
                            ⭐ {{ selectedBranch.rating }}
                        </a-tag>
                    </div>

                    <p class="modal-description">{{ selectedBranch.description }}</p>

                    <a-space direction="vertical" size="middle" class="modal-info">
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
                                <div class="modal-info-value">{{ selectedBranch.workTime }}</div>
                            </div>
                        </div>
                    </a-space>

                    <div class="services-section">
                        <div class="services-title">Xizmatlar:</div>
                        <div class="services-tags">
                            <a-tag v-for="(service, index) in selectedBranch.services" :key="index" color="blue"
                                class="service-tag">
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
            </a-modal>
        </div>
    </div>
    <div v-else-if="!loading && filialsData.length === 0">
        <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
            <template #extra>
                <a-button type="primary" @click="handleReload">Reload</a-button>
            </template>
        </a-result>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
//Antd
import {
    SearchOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    ClockCircleOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
//FireStore
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from '@/FireBase/config';

// Reactive o'zgaruvchilar
const searchText = ref('');
const currentPage = ref(1);
const selectedBranch = ref(null);
const isModalVisible = ref(false);
const pageSize = 6;
const filialsData = ref([]);
const loading = ref(false);

// Computed properties
const filteredBranches = computed(() => {
    return filialsData.value.filter(branch =>
        branch.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchText.value.toLowerCase())
    );
});

const paginatedBranches = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = start + pageSize;
    return filteredBranches.value.slice(start, end);
});

// Methods
const showModal = (branch) => {
    selectedBranch.value = branch;
    isModalVisible.value = true;
};

const handleSearch = (value) => {
    currentPage.value = 1;
};

const handlePageChange = (page) => {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleReload = () => {
    window.location.reload()
}

onMounted(() => {
    const getFilials = async () => {
        loading.value = true
        try {
            const querySnapshot = await getDocs(collection(db, 'filias'));
            filialsData.value = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            message.error(error.message)
        } finally {
            loading.value = false;
        }
    }
    getFilials()
})
</script>

<style scoped>
.example {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.05);
    height: 100vh;
    width: 100vw;
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 30px 50px;
}

.branches-container {
    min-height: 100vh;
    background: linear-gradient(135deg, rgba(24, 144, 255, 0.95) 0%, rgba(9, 109, 217, 0.95) 100%);
    padding: 40px 20px;
}

.branches-wrapper {
    max-width: 1400px;
    margin: 0 auto;
}

/* Header */
.header-section {
    text-align: center;
    margin-bottom: 40px;
    color: white;
}

.main-title {
    font-size: clamp(28px, 5vw, 42px);
    font-weight: 700;
    margin-bottom: 12px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
    font-size: clamp(14px, 2vw, 18px);
    opacity: 0.95;
    max-width: 600px;
    margin: 0 auto;
}

/* Qidiruv */
.search-section {
    margin-bottom: 32px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.search-input {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-input :deep(.ant-input-search-button) {
    border-radius: 0 8px 8px 0;
}

/* Natijalar */
.results-count {
    text-align: center;
    margin-bottom: 24px;
}

.result-tag {
    background: white;
    color: #667eea;
    font-weight: 500;
    padding: 4px 16px;
    font-size: 14px;
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

    .modal-header {
        flex-direction: column;
        gap: 12px;
    }

    .modal-rating {
        align-self: flex-start;
    }
}
</style>
<template>
    <div class="consultations-container">
        <!-- Loading State -->
        <div v-if="loading" class="loading-wrapper">
            <a-spin size="large" tip="Yuklanmoqda..." />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-wrapper">
            <a-empty description="Ma'lumotlarni yuklashda xatolik yuz berdi">
                <a-button type="primary" @click="getUserConsultations">
                    Qayta urinish
                </a-button>
            </a-empty>
        </div>

        <!-- Empty State -->
        <div v-else-if="consultations.length === 0" class="empty-wrapper">
            <a-empty description="Sizda hozircha konsultatsiyalar yo'q">
                <RouterLink to="/doctors">
                    <a-button type="primary">Shifokorlarni ko'rish</a-button>
                </RouterLink>
            </a-empty>
        </div>

        <!-- Consultations List -->
        <div v-else class="consultations-list">
            <h2 class="page-title">Mening konsultatsiyalarim</h2>
            
            <div class="cards-grid">
                <div v-for="item in userActiveConsultations" :key="item.konsultateId" class="consultation-card-wrapper">
                    <a-card :hoverable="true" class="consultation-card">
                        <div class="card-header">
                            <a-avatar :size="56" class="doctor-avatar">
                                {{ item.doktorName.charAt(0) }}
                            </a-avatar>
                            <div class="doctor-info">
                                <h3 class="doctor-name">{{ item.doktorName }}</h3>
                                <p class="specialty">{{ item.specialty }}</p>
                            </div>
                        </div>

                        <a-divider class="card-divider" />

                        <div class="card-details">
                            <div class="detail-row">
                                <CalendarOutlined class="icon" />
                                <span>{{ formatDate(item.kuni.toDate()) }}</span>
                            </div>
                            <div class="detail-row">
                                <ClockCircleOutlined class="icon" />
                                <span>{{ item.vaqti }}</span>
                            </div>
                            <div class="detail-row">
                                <IdcardOutlined class="icon" />
                                <span>ID: {{ String(item.konsultateId).slice(-8) }}</span>
                            </div>
                        </div>

                        <div class="card-footer">
                            <a-tag :color="item.qabulQilingan ? 'success' : 'processing'" class="status-tag">
                                {{ item.qabulQilingan ? 'Qabul qilindi' : 'Jarayonda' }}
                            </a-tag>
                            
                            <div class="action-buttons">
                                <RouterLink :to="`/doctors/${item.doktorID}`">
                                    <a-button type="default" size="small">
                                        <EyeOutlined /> Ko'rish
                                    </a-button>
                                </RouterLink>
                                
                                <a-popconfirm 
                                    title="Konsultatsiyani rostdan bekor qilmoqchimisiz?" 
                                    ok-text="Ha" 
                                    cancel-text="Yo'q"
                                    @confirm="cancelConsultate(item.doktorID)"
                                >
                                    <a-button type="primary" danger size="small">
                                        <DeleteOutlined /> Bekor qilish
                                    </a-button>
                                </a-popconfirm>
                            </div>
                        </div>
                    </a-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
//Vue
import { computed, onMounted, ref, toRaw } from 'vue';
//Firebase
import { db } from '@/FireBase/config'
import { arrayRemove, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
//userStore
import { useUsersStore } from '@/Store/useUserStore'
//dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/uz-latn';
import { message } from 'ant-design-vue';
//Icons
import { CalendarOutlined, ClockCircleOutlined, IdcardOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons-vue';
//user consultations store
import { useUserConsultations } from '@/Store/useUserConsultations';

const userConsultations = useUserConsultations()

const userStore = useUsersStore();
const userId = userStore.uid

const loading = ref(false)
const consultations = ref([])
const error = ref(false)

const getUserConsultations = async () => {
    loading.value = true
    error.value = false
    consultations.value = []
    try {
        const response = await getDoc(doc(db, 'users', userId))
        const userConsultations = response.data().consultations
        
        for (const consulatation of userConsultations) {
            const item = await getConsultate(consulatation)
            if (item) {
                consultations.value.push(item)
            }
        }
        console.log(toRaw(consultations.value))
    } catch (error) {
        console.log(error)
        error.value = true
    } finally {
        loading.value = false
    }
}

const userActiveConsultations = computed(() => {
    return consultations.value
})

const getConsultate = async (doctorID) => {
    try {
        const response = await getDoc(doc(db, 'consultations', doctorID, 'doctorConsultations', userId))
        if (response.exists()) {
            return response.data()
        }
    } catch (error) {
        console.log(error)
    }
}

const cancelConsultate = async (doctorID) => {
    try {
        await deleteDoc(doc(db, 'consultations', doctorID, 'doctorConsultations', userId))
        await updateDoc(doc(db, 'users', userId), {
            consultations: arrayRemove(doctorID)
        })
        userConsultations.decrement()
        consultations.value = consultations.value.filter(item => item.doktorID !== doctorID)
        message.success('Konsultatsiya bekor qilindi')
    } catch (error) {
        console.log(error)
        message.error('Xatolik yuz berdi')
    }
}

//methods
const formatDate = (date) => {
    return dayjs(date).locale('uz-latn').format('DD MMMM YYYY');
};

onMounted(() => {
    getUserConsultations()
})
</script>

<style scoped>
.consultations-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 16px;
}

.loading-wrapper,
.error-wrapper,
.empty-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
}

.page-title {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #262626;
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
}

.consultation-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid #e8e8e8;
}

.consultation-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
}

.doctor-avatar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-size: 24px;
    font-weight: 600;
    flex-shrink: 0;
}

.doctor-info {
    flex: 1;
    min-width: 0;
}

.doctor-name {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #262626;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.specialty {
    font-size: 14px;
    color: #8c8c8c;
    margin: 4px 0 0 0;
}

.card-divider {
    margin: 16px 0;
}

.card-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

.detail-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #595959;
}

.detail-row .icon {
    color: #1890ff;
    font-size: 16px;
}

.card-footer {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
}

.status-tag {
    align-self: flex-start;
    font-weight: 500;
}

.action-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.action-buttons button {
    flex: 1;
    min-width: 120px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .consultations-container {
        padding: 16px 12px;
    }

    .page-title {
        font-size: 24px;
        margin-bottom: 16px;
    }

    .cards-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .doctor-name {
        font-size: 16px;
    }

    .action-buttons {
        flex-direction: column;
    }

    .action-buttons button {
        width: 100%;
        min-width: auto;
    }
}

@media (max-width: 480px) {
    .consultations-container {
        padding: 12px 8px;
    }

    .card-header {
        gap: 12px;
    }

    .doctor-avatar {
        width: 48px;
        height: 48px;
        font-size: 20px;
    }

    .detail-row {
        font-size: 13px;
    }
}
</style>
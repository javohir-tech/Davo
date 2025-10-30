<template>
  <div class="doctor-profile-page">
    <div class="container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <a-spin size="large" tip="Shifokor ma'lumotlari yuklanmoqda..." />
      </div>

      <!-- Error State -->
      <a-result v-else-if="!loading && !dataById" status="404" title="Shifokor topilmadi"
        sub-title="Kechirasiz, siz qidirayotgan shifokor mavjud emas.">
        <template #extra>
          <a-button type="primary" @click="$router.push('/')">
            Bosh sahifaga qaytish
          </a-button>
        </template>
      </a-result>

      <!-- Doctor Content -->
      <template v-else-if="dataById">
        <!-- Doctor Card -->
        <a-card class="doctor-card" :bordered="false">
          <div class="doctor-header">
            <a-avatar :size="120" class="doctor-avatar">
              {{ getInitials(dataById.fullName) }}
            </a-avatar>
            <div class="doctor-info">
              <h1>{{ dataById.fullName }}</h1>
              <p><a-tag color="blue" style="font-size: 16px; padding: 5px 15px;">{{ dataById.specialty }}</a-tag></p>
              <p>{{ dataById.category }} • {{ dataById.degree }}</p>
              <p><strong>Tajriba:</strong> {{ dataById.experience }} yil</p>
            </div>
          </div>

          <div class="doctor-body">
            <!-- Info Grid -->
            <a-row :gutter="[20, 20]" class="info-grid">
              <a-col :xs="24" :md="12">
                <a-card class="info-card" size="small">
                  <template #title>
                    <a-space>
                      <BookOutlined />
                      <span>Ta'lim</span>
                    </a-space>
                  </template>
                  <p>{{ dataById.education }}</p>
                  <a-tag color="purple">{{ dataById.fieldOfStudy }}</a-tag>
                </a-card>
              </a-col>

              <a-col :xs="24" :md="12">
                <a-card class="info-card" size="small">
                  <template #title>
                    <a-space>
                      <CalendarOutlined />
                      <span>Ish vaqti</span>
                    </a-space>
                  </template>
                  <p><strong>Kunlar:</strong> {{ dataById.workDays }}</p>
                  <p><strong>Soatlar:</strong> {{ dataById.workHours }}</p>
                </a-card>
              </a-col>

              <a-col :xs="24" :md="12">
                <a-card class="info-card" size="small">
                  <template #title>
                    <a-space>
                      <EnvironmentOutlined />
                      <span>Ish joyi</span>
                    </a-space>
                  </template>
                  <p><strong>{{ dataById.workPlace.name }}</strong></p>
                  <p>{{ dataById.workPlace.address }}</p>
                </a-card>
              </a-col>

              <a-col :xs="24" :md="12">
                <a-card class="info-card" size="small">
                  <template #title>
                    <a-space>
                      <TrophyOutlined />
                      <span>Yutuqlar</span>
                    </a-space>
                  </template>
                  <p>{{ dataById.achievements }}</p>
                </a-card>
              </a-col>
            </a-row>

            <!-- Bio Section -->
            <a-divider orientation="left">
              <h2 class="section-title">Biografiya</h2>
            </a-divider>
            <a-card class="bio-card">
              <p>{{ dataById.bio }}</p>
            </a-card>

            <!-- Consultation Fee -->
            <a-divider orientation="left">
              <h2 class="section-title">Konsultatsiya narxi</h2>
            </a-divider>
            <a-tag color="green" style="font-size: 20px; padding: 10px 25px; border-radius: 20px;">
              {{ formatCurrency(dataById.consultationFee) }} so'm
            </a-tag>
          </div>
        </a-card>

        <!-- Booking Section -->
        <a-card v-if="!isBooked" class="booking-card" :bordered="false">
          <h2 class="section-title">Konsultatsiyaga yozilish</h2>

          <a-row :gutter="[30, 30]">
            <a-col :xs="24" :lg="12">
              <h3>Sanani tanlang</h3>
              <a-calendar v-model:value="selectedDate" :fullscreen="false" @select="onDateSelect" />
            </a-col>

            <a-col :xs="24" :lg="12">
              <h3>Vaqtni tanlang</h3>
              <div class="time-slots">
                <a-button v-for="time in availableTimes" :key="time"
                  :type="selectedTime === time ? 'primary' : 'default'"
                  :class="{ 'time-slot-selected': selectedTime === time }" @click="selectedTime = time" size="large">
                  {{ time }}
                </a-button>
              </div>

              <a-divider />

              <a-space direction="vertical" :size="15" style="width: 100%;">
                <a-alert v-if="selectedDate && selectedTime" type="info" show-icon>
                  <template #message>
                    <strong>Tanlangan sana va vaqt:</strong><br />
                    {{ formatDate(selectedDate) }} - {{ selectedTime }}
                  </template>
                </a-alert>

                <a-button type="primary" size="large" block :disabled="!selectedDate || !selectedTime"
                  :loading="bookingLoading" @click="handleBooking">
                  <template #icon>
                    <CheckCircleOutlined />
                  </template>
                  Konsultatsiyaga yozilish
                </a-button>
              </a-space>
            </a-col>
          </a-row>
        </a-card>

        <!-- Timeline after booking -->
        <a-card v-if="isBooked" class="timeline-card" :bordered="false">
          <h2 class="section-title">Konsultatsiya holati</h2>

          <a-result status="success" title="Konsultatsiyaga muvaffaqiyatli yozildingiz!"
            :sub-title="`Sana: ${formatDate(selectedDate)} - Vaqt: ${selectedTime}`" />
          <a-timeline mode="left" style="margin-top: 30px;">
            <a-timeline-item color="green">
              <template #dot>
                <CheckCircleOutlined style="font-size: 16px;" />
              </template>
              <p><strong>Konsultatsiyaga yozilish</strong></p>
              <p>{{ formatDate(selectedDate) }} - {{ selectedTime }}</p>
              <a-tag color="success">Tasdiqlandi</a-tag>
            </a-timeline-item>

            <a-timeline-item :color="isApproved ? 'green' : 'blue'">
              <template v-if="!isApproved" #dot>
                <LoadingOutlined style="font-size: 16px;" />
              </template>
              <template v-else #dot>
                <CheckCircleOutlined style="font-size: 16px;" />
              </template>
              <p><strong>Shifokor javobi kutilmoqda</strong></p>
              <p>Shifokor tez orada sizning so'rovingizni ko'rib chiqadi</p>
              <a-tag :color="isApproved ? 'green' : 'processing'">
                {{ isApproved ? 'Tasdiqlandi' : 'Jarayonda' }}
              </a-tag>
            </a-timeline-item>

            <a-timeline-item :color="isApproved ? 'blue' : 'gray'">
              <template v-if="isApproved" #dot>
                <LoadingOutlined style="font-size: 16px;" />
              </template>
              <template v-else #dot>
                <ClockCircleOutlined style="font-size: 16px;" />
              </template>
              <p><strong>Konsultatsiya</strong></p>
              <p>Belgilangan vaqtda konsultatsiya o'tkaziladi</p>
              <a-tag :color="isApproved ? 'blue' : 'gray'">
                {{ isApproved ? 'Jarayonda' : 'Kutilmoqda' }}
              </a-tag>
            </a-timeline-item>
          </a-timeline>

          <a-divider />

          <a-button type="primary" danger @click="showModal" block size="large">
            kansultatsiyani bekor qilish
          </a-button>
          <a-modal title="Kansultatsiyani bekor qilish" v-model:open="open" :footer="null">
            <p>Rostan kansultatsiyani bekor qilmoqchimisiz ?</p>
            <a-flex justify="end" gap="12">
              <a-button @click="()=>open=false">Yo'q</a-button>
              <a-button type="primary" @click="cancelConsuletation" :loading="cancelConsultationLoading">Ha</a-button>
            </a-flex>
          </a-modal>
        </a-card>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, toRaw } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import 'dayjs/locale/uz-latn';
import {
  CalendarOutlined,
  BookOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue';
//Hooks
import useDocs from '@/Hooks/useDocs';
//UserStore
import { useUsersStore } from '@/Store/useUserStore';
//Firebase
import { db } from '@/FireBase/config';
import { message } from 'ant-design-vue';
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
// use consultations store
import { useUserConsultations } from '@/Store/useUserConsultations';

const { loading, dataById, getDocumentById } = useDocs('doctors')

const userConsultations = useUserConsultations()
const userStore = useUsersStore();
const userId = userStore.uid

// Router
const route = useRoute();
const doctorId = route.params.id;

// State
const selectedDate = ref(null);
const selectedTime = ref(null);
const isBooked = ref(false);
const bookingLoading = ref(false);
const cancelConsultationLoading = ref(false);
const isApproved = ref(false);
const open = ref(false);

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_CONSULTATION_TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = import.meta.env.VITE_CONSULTATION_CHAD_ID
const TELEGRAM_BOT_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

// Available times
const availableTimes = ref([
  "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00"
]);

// Methods
const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const showModal = () => {
  open.value = true
}

const formatCurrency = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const formatDate = (date) => {
  return dayjs(date).locale('uz-latn').format('DD MMMM YYYY');
};

const onDateSelect = (date) => {
  selectedDate.value = date;
};

const handleBooking = async () => {

  if (!userStore.isActive) {
    message.warning('Ro\'yhatdan o\'ting')
    return
  }

  if (selectedDate.value && selectedTime.value) {
    bookingLoading.value = true;
    try {
      const date = new Date(selectedDate.value);
      const time = selectedTime.value;
      await setDoc(doc(db, 'consultations', doctorId, 'doctorConsultations', userId), {
        username: userStore.username,
        userEmail: userStore.email,
        doktorName: dataById.value.fullName,
        doktorID: doctorId,
        specialty: dataById.value.specialty,
        kuni: date,
        vaqti: selectedTime.value,
        qabulQilingan: false,
        isBooked: true,
        konsultateId: new Date().getTime()
      })

      await updateDoc(doc(db, 'users', userId), {
        consultations: arrayUnion(doctorId)
      })

      userConsultations.increment()

      const messageText = `
      Doktorga yangi konsultatsiya
      Doktor: ${dataById.value.fullName}
      belgilangan kun : ${formatDate(date)} \n
      belgilangan vaqt : ${time}
      username : ${userStore.username}
      email: ${userStore.email}
      `

      fetch(TELEGRAM_BOT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: messageText,
        }),
      }).then(response => {
        if (!response.ok) {
          throw new Error('Telegram xabar yuborishda xatolik yuz berdi');
        }
        return response.json();
      })

      isBooked.value = true;
      message.success('Konsultatsiyaga muvafiqqiyatli yozildingiz');
    } catch (error) {
      message.error('Kansulatatsiyaga yozilishda hatolik');
      console.log(error)
      isBooked.value = false
    } finally {
      bookingLoading.value = false
    }
  }
};

const cancelConsuletation = async () => {
  cancelConsultationLoading.value = true
  try {
    await deleteDoc(doc(db, 'consultations', doctorId, 'doctorConsultations', userId))
    await updateDoc(doc(db, 'users', userId), {
      consultations: arrayRemove(doctorId)
    })
    userConsultations.decrement()
    selectedDate.value = null;
    selectedTime.value = null;
    isBooked.value = false;
    message.success('Kansultatsiya bekor qilindi')
  } catch (error) {
    console.log(error);
    message.error('Xatolik')
  }finally{
    cancelConsultationLoading.value = false
  }
};

// Lifecycle
onMounted(() => {
  getDocumentById(doctorId)

  const getConsultaionData = async () => {
    if (!userStore.isActive) return

    const docRef = await getDoc(doc(db, 'consultations', doctorId, 'doctorConsultations', userId))
    const consultet = docRef.data()
    if (consultet) {
      isBooked.value = consultet.isBooked
      selectedDate.value = consultet.kuni.toDate()
      selectedTime.value = consultet.vaqti
      isApproved.value = consultet.qabulQilingan
    }
  }
  getConsultaionData()
});
</script>

<style scoped>
.doctor-profile-page {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 30px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.doctor-card {
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.doctor-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  display: flex;
  align-items: center;
  gap: 30px;
  color: white;
}

.doctor-avatar {
  background: white !important;
  color: #667eea !important;
  font-weight: bold;
  font-size: 48px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.doctor-info h1 {
  margin: 0 0 15px 0;
  font-size: 32px;
  font-weight: 700;
  color: white;
}

.doctor-info p {
  margin: 8px 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.95);
}

.doctor-body {
  padding: 40px;
}

.info-grid {
  margin-bottom: 30px;
}

.info-card {
  border-left: 4px solid #667eea;
  height: 100%;
  background: #f8f9ff;
  transition: transform 0.3s, box-shadow 0.3s;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.15);
}

.info-card p {
  margin: 8px 0;
  color: #555;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.bio-card {
  background: #f8f9ff;
  margin: 20px 0;
}

.bio-card p {
  margin: 0;
  line-height: 1.8;
  color: #555;
  font-size: 16px;
}

.booking-card,
.timeline-card {
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.booking-card h2,
.timeline-card h2 {
  margin-bottom: 25px;
}

.booking-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin: 20px 0;
}

.time-slot-selected {
  font-weight: 600;
}

@media (max-width: 768px) {
  .doctor-header {
    flex-direction: column;
    text-align: center;
  }

  .doctor-info h1 {
    font-size: 24px;
  }

  .doctor-avatar {
    width: 100px !important;
    height: 100px !important;
    font-size: 36px !important;
  }

  .time-slots {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }

  .doctor-body {
    padding: 20px;
  }
}
</style>
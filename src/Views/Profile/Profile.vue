<script setup>
  import { ref, computed, onMounted, reactive } from 'vue'
  import { useUsersStore } from '@/Store/useUserStore'
  import {
    UserOutlined,
    LockOutlined,
    EditOutlined,
    LogoutOutlined,
    SaveOutlined,
    CloseOutlined,
  } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import { createAvatar } from '@dicebear/core'
  import { initials } from '@dicebear/collection'
  //FireBase
  import { auth } from '@/FireBase/config'
  import {
    updatePassword,
    updateProfile,
    reauthenticateWithCredential,
    EmailAuthProvider,
  } from 'firebase/auth'
  //Hooks
  import { useAuthFireBase } from '@/Hooks/useAuthFireBase'

  const { logOut } = useAuthFireBase()

  const store = useUsersStore()

  const open = ref(false)
  const profilImgURL = ref('')
  const editMode = ref(false)
  const loading = ref(false)

  // Form reference
  const formRef = ref()

  // Reactive form data
  const formData = reactive({
    username: store.username || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Validation rules
  const rules = {
    username: [
      {
        required: true,
        message: 'Foydalanuvchi nomi kiritilishi shart',
        trigger: 'blur',
      },
      { min: 6, message: "Kamida 6 ta belgi bo'lishi kerak", trigger: 'blur' },
    ],
    newPassword: [
      {
        min: 8,
        message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
        trigger: 'blur',
      },
    ],
    confirmPassword: [
      {
        validator: (rule, value) => {
          if (value && value !== formData.newPassword) {
            return Promise.reject('Parollar mos kelmadi')
          }
          return Promise.resolve()
        },
        trigger: 'change',
      },
    ],
  }

  const getAvatar = () => {
    const avatar = createAvatar(initials, {
      seed: store.username || 'User',
      backgroundColor: ['667eea', '764ba2', 'f093fb', '4facfe'],
    })
    profilImgURL.value = avatar.toDataUri()
    return profilImgURL.value
  }

  const displayAvatar = computed(() => {
    return store.photoURL || profilImgURL.value
  })

  const isFormValid = computed(() => {
    if (editMode.value) {
      return formData.username.trim().length >= 6
    }
    return true
  })

  const handleEditToggle = () => {
    if (editMode.value) {
      formData.username = store.username || ''
      formData.currentPassword = ''
      formData.newPassword = ''
      formData.confirmPassword = ''
      editMode.value = false
      formRef.value?.clearValidate()
    } else {
      editMode.value = true
    }
  }

  const handleSaveProfile = async () => {
    try {
      // Form validatsiyasini tekshirish
      await formRef.value?.validate()

      loading.value = true

      const user = auth.currentUser

      if (!user) {
        message.error('Foydalanuvchi topilmadi!')
        loading.value = false
        return
      }

      const currentPassword = formData.currentPassword.trim()
      const newPassword = formData.newPassword.trim()
      const confirmPassword = formData.confirmPassword.trim()
      const username = formData.username.trim()

      let usernameChanged = false
      let passwordChanged = false

      // Username o'zgartirish
      if (username !== store.username && username) {
        try {
          await updateProfile(user, {
            displayName: username,
          })
          store.editUsername(username)
          usernameChanged = true
        } catch (error) {
          message.error('Username yangilanmadi!')
          console.error(error)
        }
      }

      // Parol o'zgartirish
      if (currentPassword || newPassword || confirmPassword) {
        // Barcha parol maydonlari to'ldirilganligini tekshirish
        if (!currentPassword || !newPassword || !confirmPassword) {
          message.warning(
            "Parolni o'zgartirish uchun barcha maydonlarni to'ldiring!"
          )
          loading.value = false
          return
        }

        // Parollar mos kelishini tekshirish
        if (newPassword !== confirmPassword) {
          message.error('Yangi parollar mos kelmadi!')
          loading.value = false
          return
        }

        // Parol uzunligini tekshirish
        if (newPassword.length < 8) {
          message.warning(
            "Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak!"
          )
          loading.value = false
          return
        }

        try {
          // Foydalanuvchini qayta autentifikatsiya qilish
          const credential = EmailAuthProvider.credential(
            user.email,
            currentPassword
          )
          await reauthenticateWithCredential(user, credential)

          // Yangi parolni o'rnatish
          await updatePassword(user, newPassword)
          store.editPassword(newPassword)
          passwordChanged = true
        } catch (error) {
          if (error.code === 'auth/wrong-password') {
            message.error("Joriy parol noto'g'ri!")
          } else if (error.code === 'auth/weak-password') {
            message.error('Parol juda zaif!')
          } else {
            message.error('Parol yangilanmadi!')
          }
          console.error(error)
          loading.value = false
          return
        }
      }

      // Muvaffaqiyat xabari
      if (usernameChanged && passwordChanged) {
        message.success('Profil va parol muvaffaqiyatli yangilandi!')
      } else if (usernameChanged) {
        message.success('Profil muvaffaqiyatli yangilandi!')
      } else if (passwordChanged) {
        message.success('Parol muvaffaqiyatli yangilandi!')
      } else {
        message.info("Hech qanday o'zgarish kiritilmadi")
      }

      editMode.value = false

      // Form maydonlarini tozalash
      formData.currentPassword = ''
      formData.newPassword = ''
      formData.confirmPassword = ''
    } catch (error) {
      if (error.errorFields) {
        message.error("Iltimos, formani to'g'ri to'ldiring!")
      } else {
        message.error('Xatolik yuz berdi!')
        console.error(error)
      }
    } finally {
      loading.value = false
    }
  }

  const showModal = () => {
    open.value = true
  }

  const handleOk = () => {
    logOut()
    open.value = false
  }

  onMounted(() => {
    if (!store.photoURL) {
      getAvatar()
    } else {
      profilImgURL.value = store.photoURL
    }
  })
</script>

<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-content">
        <!-- Avatar Section -->
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <a-avatar :size="140" :src="displayAvatar" class="profile-avatar">
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
          </div>

          <div class="user-info-header">
            <h2 class="username">{{ store.username || 'Foydalanuvchi' }}</h2>
            <p class="user-email">{{ store.email || 'email@example.com' }}</p>
          </div>
        </div>

        <!-- Single Form -->
        <a-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          layout="vertical"
        >
          <!-- Info Cards -->
          <div class="info-section">
            <!-- Profile Info Card -->
            <a-card class="info-card" :bordered="false">
              <template #title>
                <div class="card-header">
                  <UserOutlined class="card-icon" />
                  <span>Shaxsiy Ma'lumotlar</span>
                </div>
              </template>

              <template #extra>
                <a-button
                  v-if="!editMode"
                  type="primary"
                  @click="handleEditToggle"
                  class="action-btn"
                >
                  <template #icon>
                    <EditOutlined />
                  </template>
                  Tahrirlash
                </a-button>

                <a-space v-else>
                  <a-button @click="handleEditToggle" class="action-btn">
                    <template #icon>
                      <CloseOutlined />
                    </template>
                    Bekor qilish
                  </a-button>
                  <a-button
                    type="primary"
                    @click="handleSaveProfile"
                    :loading="loading"
                    :disabled="!isFormValid"
                    class="action-btn"
                  >
                    <template #icon>
                      <SaveOutlined />
                    </template>
                    Saqlash
                  </a-button>
                </a-space>
              </template>

              <div class="form-content">
                <!-- Username -->
                <a-form-item label="Foydalanuvchi nomi" name="username">
                  <a-input
                    v-model:value="formData.username"
                    size="large"
                    placeholder="Foydalanuvchi nomini kiriting"
                    :disabled="!editMode"
                  >
                    <template #prefix>
                      <UserOutlined />
                    </template>
                  </a-input>
                </a-form-item>

                <!-- Email (Read Only) -->
                <a-form-item label="Email">
                  <a-input :value="store.email" size="large" disabled>
                    <template #prefix>
                      <UserOutlined />
                    </template>
                  </a-input>
                </a-form-item>
              </div>
            </a-card>

            <!-- Password Change Card -->
            <a-card class="info-card" :bordered="false" v-if="editMode">
              <template #title>
                <div class="card-header">
                  <LockOutlined class="card-icon" />
                  <span>Parolni O'zgartirish</span>
                </div>
              </template>

              <div class="form-content">
                <a-form-item label="Joriy parol" name="currentPassword">
                  <a-input-password
                    v-model:value="formData.currentPassword"
                    size="large"
                    placeholder="Joriy parolingizni kiriting"
                  >
                    <template #prefix>
                      <LockOutlined />
                    </template>
                  </a-input-password>
                </a-form-item>

                <a-row :gutter="16">
                  <a-col :xs="24" :md="12">
                    <a-form-item label="Yangi parol" name="newPassword">
                      <a-input-password
                        v-model:value="formData.newPassword"
                        size="large"
                        placeholder="Yangi parolni kiriting"
                      >
                        <template #prefix>
                          <LockOutlined />
                        </template>
                      </a-input-password>
                    </a-form-item>
                  </a-col>

                  <a-col :xs="24" :md="12">
                    <a-form-item
                      label="Parolni tasdiqlash"
                      name="confirmPassword"
                    >
                      <a-input-password
                        v-model:value="formData.confirmPassword"
                        size="large"
                        placeholder="Parolni qayta kiriting"
                      >
                        <template #prefix>
                          <LockOutlined />
                        </template>
                      </a-input-password>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-alert
                  message="Parolni o'zgartirish ixtiyoriy. Agar parolni o'zgartirmoqchi bo'lsangiz, barcha parol maydonlarini to'ldiring."
                  type="info"
                  show-icon
                />
              </div>
            </a-card>

            <!-- Logout Section -->
            <div class="logout-section">
              <a-button
                danger
                size="large"
                @click="showModal"
                class="logout-btn"
              >
                <template #icon>
                  <LogoutOutlined />
                </template>
                Tizimdan chiqish
              </a-button>
            </div>
            <a-modal
              v-model:open="open"
              title="Tizimdan chiqish"
              @ok="handleOk"
            >
              <p>Siz haqiqatan ham tizimdan chiqmoqchimisiz?</p>
            </a-modal>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .profile-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
  }

  .profile-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Avatar Section */
  .avatar-section {
    background: white;
    border-radius: 20px;
    padding: 40px;
    margin-bottom: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .avatar-wrapper {
    flex-shrink: 0;
  }

  .profile-avatar {
    border: 4px solid white;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .user-info-header {
    flex: 1;
  }

  .username {
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .user-email {
    font-size: 16px;
    color: #64748b;
    margin: 0;
  }

  /* Info Section */
  .info-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .info-card {
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }

  .info-card:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  .info-card :deep(.ant-card-head) {
    background: linear-gradient(135deg, #f8f9fc 0%, #eef2f7 100%);
    border-bottom: 2px solid #e2e8f0;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 18px;
    font-weight: 600;
    color: #334155;
  }

  .card-icon {
    font-size: 20px;
    color: #667eea;
  }

  .form-content {
    padding: 8px 0;
  }

  .action-btn {
    border-radius: 10px;
    height: 36px;
    font-weight: 600;
  }

  /* Logout Section */
  .logout-section {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }

  .logout-btn {
    height: 48px;
    padding: 0 40px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    transition: all 0.3s ease;
  }

  .logout-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .profile-page {
      padding: 16px;
    }

    .avatar-section {
      flex-direction: column;
      text-align: center;
      padding: 32px 24px;
    }

    .username {
      font-size: 28px;
    }

    .profile-avatar {
      width: 120px !important;
      height: 120px !important;
    }
  }

  @media (max-width: 576px) {
    .profile-page {
      padding: 12px;
    }

    .avatar-section {
      padding: 20px 16px;
    }

    .profile-avatar {
      width: 100px !important;
      height: 100px !important;
    }

    .username {
      font-size: 24px;
    }

    .user-email {
      font-size: 14px;
    }

    .logout-btn {
      height: 44px;
      padding: 0 32px;
      font-size: 15px;
    }

    .card-header {
      font-size: 14px;
    }
  }
</style>

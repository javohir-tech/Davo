<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <div class="logo">
          <div class="logo-icon">🚀</div>
        </div>
        <h1>Ro'yxatdan o'tish</h1>
        <p>Hisobingizni yarating va boshlaymiz</p>
      </div>

      <div class="register-body">
        <a-form :model="formData" :rules="rules" layout="vertical" @finish="handleRegister" ref="formRef">
          <!-- Username Input -->
          <a-form-item label="Foydalanuvchi nomi" name="username">
            <a-input v-model:value="formData.username" size="large" placeholder="username">
              <template #prefix>
                <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input>
          </a-form-item>

          <!-- Email Input -->
          <a-form-item label="Email" name="email">
            <a-input v-model:value="formData.email" size="large" type="email" placeholder="email@example.com">
              <template #prefix>
                <MailOutlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input>
          </a-form-item>

          <!-- Password Input -->
          <a-form-item label="Parol" name="password">
            <a-input-password v-model:value="formData.password" size="large" placeholder="Parol yarating">
              <template #prefix>
                <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input-password>
          </a-form-item>

          <!-- Confirm Password Input -->
          <a-form-item label="Parolni tasdiqlash" name="confirmPassword">
            <a-input-password v-model:value="formData.confirmPassword" size="large"
              placeholder="Parolni qayta kiriting">
              <template #prefix>
                <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input-password>
          </a-form-item>

          <!-- Terms Checkbox -->
          <a-form-item name="agree">
            <a-checkbox v-model:checked="formData.agree">
              Men <a href="#">Foydalanish shartlari</a> va
              <a href="#">Maxfiylik siyosati</a>ga roziman
            </a-checkbox>
          </a-form-item>

          <!-- Submit Button -->
          <a-form-item>
            <a-button type="primary" html-type="submit" size="large" :loading="loading" block class="submit-btn">
              Ro'yxatdan o'tish
            </a-button>
          </a-form-item>
        </a-form>

        <!-- Divider -->
        <div class="divider">
          <span>yoki</span>
        </div>

        <!-- Google Sign Up Button -->
        <a-button size="large" block class="google-btn" @click="handleGoogleRegister">
          <span class="google-icon">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4"
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
              <path fill="#34A853"
                d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
              <path fill="#FBBC05"
                d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" />
              <path fill="#EA4335"
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" />
            </svg>
          </span>
          Google orqali ro'yxatdan o'tish
        </a-button>

        <!-- Login Link -->
        <div class="login-link">
          Hisobingiz bormi? <a href="#" @click.prevent="goToLogin">Kirish</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
} from '@ant-design/icons-vue'
//Hooks
import { useAuthFireBase } from '@/Hooks/useAuthFireBase'

import { useRouter } from 'vue-router'

const router = useRouter()

const { loading, registerUser } = useAuthFireBase()

// Form ref
const formRef = ref()
// const loading = ref(false)

// Form data - Bu o'zgaruvchilarni siz ishlatishingiz mumkin
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false,
})

// Validation rules
const rules = {
  username: [
    {
      required: true,
      message: 'Foydalanuvchi nomini kiriting',
      trigger: 'blur',
    },
    { min: 3, message: "Kamida 3 ta belgi bo'lishi kerak", trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Email kiriting', trigger: 'blur' },
    { type: 'email', message: "Email formati noto'g'ri", trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Parol kiriting', trigger: 'blur' },
    {
      min: 6,
      message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: 'Parolni tasdiqlang', trigger: 'blur' },
    {
      validator: (rule, value) => {
        if (value !== formData.password) {
          return Promise.reject('Parollar mos kelmadi')
        }
        return Promise.resolve()
      },
      trigger: 'blur',
    },
  ],
  agree: [
    {
      validator: (rule, value) => {
        if (!value) {
          return Promise.reject('Shartlarga rozilik berishingiz kerak')
        }
        return Promise.resolve()
      },
      trigger: 'change',
    },
  ],
}

const handleRegister = (formData) => {
  registerUser(formData.email, formData.password, formData.username)
}

// Google register function - Bu yerda Google OAuth logikasini yozasiz
const handleGoogleRegister = () => {
  console.log("Google orqali ro'yxatdan o'tish")

  message.info("Google orqali ro'yxatdan o'tish...")
}

// Login page function - Login sahifasiga o'tish
const goToLogin = () => {
  router.push('/login')

  message.info("Login sahifasiga o'tish...")
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  max-width: 480px;
  width: 100%;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 50px 40px 40px;
  text-align: center;
  color: white;
  position: relative;
}

.logo {
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 48px;
  display: inline-block;
  animation: bounce 2s infinite;
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.register-header h1 {
  font-size: 32px;
  margin-bottom: 10px;
  font-weight: 700;
}

.register-header p {
  font-size: 15px;
  opacity: 0.95;
}

.register-body {
  padding: 40px;
}

.submit-btn {
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  margin-top: 10px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.divider {
  text-align: center;
  margin: 30px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #e0e0e0;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  padding: 0 15px;
  color: #999;
  font-size: 14px;
  background: white;
  position: relative;
}

.google-btn {
  height: 50px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s ease;
  background: white;
  color: #333;
}

.google-btn:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  color: #333;
}

.google-icon {
  display: flex;
  align-items: center;
}

.login-link {
  text-align: center;
  margin-top: 30px;
  font-size: 15px;
  color: #666;
}

.login-link a {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  margin-left: 5px;
}

.login-link a:hover {
  color: #764ba2;
  text-decoration: underline;
}

:deep(.ant-input),
:deep(.ant-input-password),
:deep(.ant-input-affix-wrapper) {
  border-radius: 10px;
  border: 2px solid #e8e8e8;
  transition: all 0.3s ease;
}

:deep(.ant-input:hover),
:deep(.ant-input-password:hover),
:deep(.ant-input-affix-wrapper:hover) {
  border-color: #667eea;
}

:deep(.ant-input:focus),
:deep(.ant-input-password:focus),
:deep(.ant-input-affix-wrapper:focus),
:deep(.ant-input-affix-wrapper-focused) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

:deep(.ant-form-item-label > label) {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

:deep(.ant-checkbox-wrapper) {
  font-size: 14px;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #667eea;
  border-color: #667eea;
}

@media (max-width: 576px) {
  .register-header {
    padding: 40px 30px 30px;
  }

  .register-header h1 {
    font-size: 28px;
  }

  .register-body {
    padding: 30px;
  }

  .logo-icon {
    font-size: 40px;
  }
}
</style>

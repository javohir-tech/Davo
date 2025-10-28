<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <div class="logo-icon">🔐</div>
        </div>
        <h1>Xush kelibsiz</h1>
        <p>Hisobingizga kiring va davom eting</p>
      </div>

      <div class="login-body">
        <a-form :model="formData" :rules="rules" layout="vertical" @finish="handleLogin" ref="formRef">
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
            <a-input-password v-model:value="formData.password" size="large" placeholder="Parolingizni kiriting">
              <template #prefix>
                <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input-password>
          </a-form-item>

          <!-- Remember & Forgot -->
          <a-form-item>
            <div class="extra-options">
              <a-checkbox v-model:checked="formData.remember">
                Eslab qolish
              </a-checkbox>
              <a href="#" @click.prevent="handleForgotPassword" class="forgot-link">
                Parolni unutdingizmi?
              </a>
            </div>
          </a-form-item>

          <!-- Submit Button -->
          <a-form-item>
            <a-button type="primary" html-type="submit" size="large" :loading="loading" block class="submit-btn">
              Kirish
            </a-button>
          </a-form-item>
        </a-form>

        <!-- Divider -->
        <div class="divider">
          <span>yoki</span>
        </div>

        <!-- Google Sign In Button -->
        <a-button size="large" block class="google-btn" @click="handleGoogleLogin">
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
          Google orqali kirish
        </a-button>

        <!-- Register Link -->
        <div class="register-link">
          Hisobingiz yo'qmi?
          <a href="#" @click.prevent="goToRegister">Ro'yxatdan o'tish</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { MailOutlined, LockOutlined } from '@ant-design/icons-vue'

//Hooks
import { useAuthFireBase } from '@/Hooks/useAuthFireBase'

import { useRouter } from 'vue-router'

const { loading, loginUser, signInWithGoogle } = useAuthFireBase()

const router = useRouter()
// Form ref
const formRef = ref()

// Form data - Bu o'zgaruvchilarni siz ishlatishingiz mumkin
const formData = reactive({
  email: '',
  password: '',
  remember: false,
})

// Validation rules
const rules = {
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
}

// Login function - Bu yerda o'z logikangizni yozasiz
const handleLogin = (formData) => {
  loginUser(formData.email, formData.password)
}

// Google login function - Bu yerda Google OAuth logikasini yozasiz
const handleGoogleLogin = () => {
  signInWithGoogle()
}
const handleForgotPassword = () => {
  console.log('Parolni unutdim')
  message.info("Parolni tiklash sahifasiga o'tish...")
}

// Register page function - Register sahifasiga o'tish
const goToRegister = () => {
  router.push('/register')

  message.info("Register sahifasiga o'tish...")
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
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

.login-header {
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

.login-header h1 {
  font-size: 32px;
  margin-bottom: 10px;
  font-weight: 700;
}

.login-header p {
  font-size: 15px;
  opacity: 0.95;
}

.login-body {
  padding: 40px;
}

.extra-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
}

.forgot-link:hover {
  color: #764ba2;
  text-decoration: underline;
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

.register-link {
  text-align: center;
  margin-top: 30px;
  font-size: 15px;
  color: #666;
}

.register-link a {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  margin-left: 5px;
}

.register-link a:hover {
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
  .login-header {
    padding: 40px 30px 30px;
  }

  .login-header h1 {
    font-size: 28px;
  }

  .login-body {
    padding: 30px;
  }

  .logo-icon {
    font-size: 40px;
  }

  .extra-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>

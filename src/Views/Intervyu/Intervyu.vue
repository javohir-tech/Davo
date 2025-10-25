<template>
  <div class="contact-page">
    <div class="contact-container">
      <!-- Sahifa sarlavhasi -->
      <div class="page-header">
        <h1 class="page-title">Biz bilan bog'laning</h1>
        <p class="page-subtitle">
          Sizni bezovta qilayotgan muammolar haqida bizga xabar bering.
          Mutaxassislarimiz tez orada siz bilan bog'lanishadi.
        </p>
      </div>

      <!-- Forma -->
      <div class="form-wrapper">
        <a-form
          :model="formState"
          :rules="rules"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
          @finish="onSubmit"
          ref="formRef"
          layout="vertical"
        >
          <!-- Ism -->
          <a-form-item label="To'liq ism" name="fullName" has-feedback>
            <a-input
              v-model:value="formState.fullName"
              placeholder="Ismingiz va familiyangizni kiriting"
              size="large"
              :prefix="h(UserOutlined)"
            />
          </a-form-item>

          <!-- Yosh -->
          <a-form-item label="Yoshingiz" name="age" has-feedback>
            <a-input-number
              v-model:value="formState.age"
              placeholder="Yoshingizni kiriting"
              size="large"
              :min="1"
              :max="120"
              style="width: 100%"
            />
          </a-form-item>

          <!-- Telefon -->
          <a-form-item label="Telefon raqami" name="phone" has-feedback>
            <a-input
              v-model:value="formState.phone"
              placeholder="+998 90 123 45 67"
              size="large"
              :prefix="h(PhoneOutlined)"
            />
          </a-form-item>

          <!-- Kasallik tavsifi -->
          <a-form-item
            label="Sizni bezovta qilayotgan muammo"
            name="description"
            has-feedback
          >
            <a-textarea
              v-model:value="formState.description"
              placeholder="Kasallik yoki muammo haqida qisqacha ma'lumot bering..."
              :rows="5"
              size="large"
              :maxlength="500"
              show-count
            />
          </a-form-item>

          <!-- Yuborish tugmasi -->
          <a-form-item class="submit-section">
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="loading"
              block
            >
              <template #icon>
                <SendOutlined />
              </template>
              Yuborish
            </a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- Qo'shimcha ma'lumot -->
      <div class="info-section">
        <a-alert type="info" show-icon closable>
          <template #message>
            <span style="font-weight: 600">Eslatma</span>
          </template>
          <template #description>
            Ma'lumotlaringiz maxfiy saqlanadi va faqat shifokorlarimiz tomonidan
            ko'rib chiqiladi. Biz 24 soat ichida siz bilan bog'lanamiz.
          </template>
        </a-alert>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, h } from 'vue'
  import { message } from 'ant-design-vue'
  import {
    UserOutlined,
    PhoneOutlined,
    SendOutlined,
  } from '@ant-design/icons-vue'

  //
  const Token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
  const chatId = import.meta.env.VITE_TELEGRAM_CHAD_ID
  // Form ref
  const formRef = ref()

  // Loading holati
  const loading = ref(false)

  // Forma ma'lumotlari
  const formState = reactive({
    fullName: '',
    age: null,
    phone: '',
    description: '',
  })

  // Validatsiya qoidalari
  const rules = {
    fullName: [
      {
        required: true,
        message: "Iltimos, to'liq ismingizni kiriting",
        trigger: 'blur',
      },
      {
        min: 3,
        message: "Ism kamida 3 ta belgidan iborat bo'lishi kerak",
        trigger: 'blur',
      },
      {
        pattern: /^[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ\s]+$/,
        message: "Ism faqat harflardan iborat bo'lishi kerak",
        trigger: 'blur',
      },
    ],
    age: [
      {
        required: true,
        message: 'Iltimos, yoshingizni kiriting',
        trigger: 'blur',
      },
      {
        type: 'number',
        min: 1,
        max: 120,
        message: "Yosh 1 dan 120 gacha bo'lishi kerak",
        trigger: 'blur',
      },
    ],
    phone: [
      {
        required: true,
        message: 'Iltimos, telefon raqamingizni kiriting',
        trigger: 'blur',
      },
      {
        pattern:
          /^(\+998|998)?[\s\-]?[0-9]{2}[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
        message:
          "Telefon raqami noto'g'ri formatda. Masalan: +998 90 123 45 67",
        trigger: 'blur',
      },
    ],
    description: [
      {
        required: true,
        message: "Iltimos, muammo haqida ma'lumot bering",
        trigger: 'blur',
      },
      {
        min: 10,
        message: "Tavsif kamida 10 ta belgidan iborat bo'lishi kerak",
        trigger: 'blur',
      },
    ],
  }

  // Telegramga xabar yuborish funksiyasi
  const sendToTelegram = async (data) => {
    const messageText = `
🏥 Yangi murojaat!

👤 Ism: ${data.fullName}
🎂 Yosh: ${data.age}
📞 Telefon: ${data.phone}

💬 Muammo tavsifi:
${data.description}

⏰ Sana: ${new Date().toLocaleString('uz-UZ')}
  `.trim()

    const url = `https://api.telegram.org/bot${Token}/sendMessage`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
      }),
    })

    if (!response.ok) {
      throw new Error('Telegram xabar yuborishda xatolik yuz berdi')
    }

    return await response.json()
  }

  // Forma yuborilganda
  const onSubmit = async () => {
    try {
      loading.value = true

      // Telegramga yuborish
      await sendToTelegram(formState)

      // Muvaffaqiyatli xabar
      message.success({
        content:
          "Murojaatingiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz.",
        duration: 5,
      })

      // Formani tozalash
      formRef.value.resetFields()
    } catch (error) {
      console.error('Xatolik:', error)

      // Xatolik xabari
      message.error({
        content:
          "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring yoki to'g'ridan-to'g'ri qo'ng'iroq qiling.",
        duration: 5,
      })
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
  .contact-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .contact-container {
    max-width: 600px;
    width: 100%;
  }

  .page-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .page-title {
    font-size: 36px;
    font-weight: 700;
    color: white;
    margin-bottom: 12px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .page-subtitle {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.95);
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto;
  }

  .form-wrapper {
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    margin-bottom: 24px;
  }

  .submit-section {
    margin-top: 32px;
    margin-bottom: 0;
  }

  .info-section {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(10px);
  }

  /* Form elementlari uchun qo'shimcha stillar */
  :deep(.ant-form-item-label > label) {
    font-weight: 600;
    font-size: 15px;
  }

  :deep(.ant-input-affix-wrapper),
  :deep(.ant-input),
  :deep(.ant-input-number),
  :deep(.ant-input-textarea-show-count::after) {
    border-radius: 8px;
  }

  :deep(.ant-btn-primary) {
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    transition: all 0.3s ease;
  }

  :deep(.ant-btn-primary:hover) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .contact-page {
      padding: 20px 16px;
    }

    .page-title {
      font-size: 28px;
    }

    .page-subtitle {
      font-size: 14px;
    }

    .form-wrapper {
      padding: 24px;
      border-radius: 12px;
    }

    .icon-wrapper {
      width: 64px;
      height: 64px;
    }

    .header-icon {
      font-size: 32px;
    }
  }

  @media (max-width: 480px) {
    .page-title {
      font-size: 24px;
    }

    .form-wrapper {
      padding: 20px;
    }

    :deep(.ant-form-item-label > label) {
      font-size: 14px;
    }
  }

  /* Alert animatsiyasi */
  :deep(.ant-alert) {
    animation: slideIn 0.5s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

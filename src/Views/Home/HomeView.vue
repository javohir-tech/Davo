<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <a-row :gutter="[24, 24]" align="middle">
        <a-col :xs="24" :md="12">
          <div class="hero-content">
            <h1 class="hero-title">Sog'ligingiz - Bizning Ustuvorligimiz</h1>
            <p class="hero-text">
              Zamonaviy tibbiy xizmatlar va professional shifokorlar bilan
              sog'lom hayot yo'lida sizning ishonchli hamkoringiz. Biz har bir
              bemorga individual yondashuv va yuqori sifatli tibbiy yordam
              ko'rsatamiz.
            </p>
            <div class="hero-buttons">
              <a-button
                type="primary"
                size="large"
                class="hero-btn"
                @click="scrollToSection('services')"
              >
                Xizmatlar
              </a-button>
              <a-button
                size="large"
                @click="scrollToSection('contact')"
                class="hero-btn-secondary hero-btn"
              >
                Bog'lanish
              </a-button>
            </div>
          </div>
        </a-col>
        <a-col :xs="24" :md="12">
          <div class="hero-image">
            <img
              src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=600&fit=crop"
              alt="Medical Clinic"
            />
          </div>
        </a-col>
      </a-row>
    </section>

    <!-- Services Section -->
    <section id="services" class="services-section">
      <div class="section-header">
        <h2 class="section-title">Bizning Xizmatlarimiz</h2>
        <p class="section-subtitle">
          Barcha turdagi tibbiy xizmatlar bir joyda
        </p>
      </div>

      <a-row :gutter="[24, 24]">
        <a-col
          v-for="service in services"
          :key="service.id"
          :xs="24"
          :sm="12"
          :lg="6"
        >
          <a-card hoverable class="service-card">
            <template #cover>
              <div class="service-image">
                <img :src="service.image" :alt="service.title" />
              </div>
            </template>
            <a-card-meta
              :title="service.title"
              :description="service.description"
            />
          </a-card>
        </a-col>
      </a-row>
    </section>

    <!-- About Us Section -->
    <section class="about-section">
      <a-row :gutter="[32, 32]" align="middle">
        <a-col :xs="24" :md="12">
          <div class="about-image">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop"
              alt="Medical Team"
            />
          </div>
        </a-col>
        <a-col :xs="24" :md="12">
          <div class="about-content">
            <h2 class="section-title">Biz Haqimizda</h2>
            <p class="about-text">
              Bizning klinikamiz 2010 yilda tashkil etilgan bo'lib, o'sha
              paytdan beri minglab bemorlarga yuqori sifatli tibbiy yordam
              ko'rsatib kelmoqdamiz. Zamonaviy uskunalar va malakali
              mutaxassislarimiz bilan biz har bir bemorga individual
              yondashamiz.
            </p>
            <p class="about-text">
              Jamoamiz 50 dan ortiq tajribali shifokor, hamshira va tibbiy
              xodimlardan iborat. Biz doimiy ravishda o'z malakamizni oshirib,
              eng so'nggi tibbiy texnologiyalardan foydalanib, bemorlarimizga
              eng yaxshi xizmatni taqdim etishga intilamiz.
            </p>
            <div class="about-stats">
              <div class="stat-item">
                <h3 class="counter" :data-target="15">{{ animatedYears }}+</h3>
                <p>Yillik Tajriba</p>
              </div>
              <div class="stat-item">
                <h3 class="counter" :data-target="50">
                  {{ animatedSpecialists }}+
                </h3>
                <p>Mutaxassislar</p>
              </div>
              <div class="stat-item">
                <h3 class="counter" :data-target="10000">
                  {{ animatedPatients }}+
                </h3>
                <p>Mamnun Bemorlar</p>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="section-header">
        <h2 class="section-title">Bemorlarimiz Fikri</h2>
        <p class="section-subtitle">
          Bizning xizmatlarimiz haqida nima deyishadi
        </p>
      </div>

      <div class="testimonials-container">
        <a-carousel
          autoplay
          :dots="true"
          class="testimonials-carousel"
          arrows
          :autoplaySpeed="5000"
        >
          <template #prevArrow>
            <div class="custom-slick-arrow" style="left: -50px">
              <span class="arrow-icon">‹</span>
            </div>
          </template>
          <template #nextArrow>
            <div class="custom-slick-arrow" style="right: -50px">
              <span class="arrow-icon">›</span>
            </div>
          </template>
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.id"
            class="testimonial-slide"
          >
            <a-card class="testimonial-card">
              <div class="testimonial-content">
                <div class="quote-icon">"</div>
                <p class="testimonial-text">{{ testimonial.text }}</p>
                <div class="testimonial-author">
                  <div class="author-avatar">
                    <img :src="testimonial.avatar" :alt="testimonial.name" />
                  </div>
                  <div>
                    <h4>{{ testimonial.name }}</h4>
                    <p>{{ testimonial.service }}</p>
                  </div>
                </div>
              </div>
            </a-card>
          </div>
        </a-carousel>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact-section">
      <div class="section-header">
        <h2 class="section-title">Biz Bilan Bog'laning</h2>
        <p class="section-subtitle">
          Savollaringiz bormi? Biz doim yordam berishga tayyormiz
        </p>
      </div>

      <a-row :gutter="[32, 32]">
        <a-col :xs="24" :md="12">
          <div class="contact-info">
            <div class="contact-item">
              <div class="contact-icon">📞</div>
              <div>
                <h4>Telefon</h4>
                <p>+998 71 123 45 67</p>
                <p>+998 90 123 45 67</p>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">📍</div>
              <div>
                <h4>Manzil</h4>
                <p>Toshkent shahri, Amir Temur ko'chasi, 108-uy</p>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">⏰</div>
              <div>
                <h4>Ish vaqti</h4>
                <p>Dushanba - Shanba: 08:00 - 20:00</p>
                <p>Yakshanba: 09:00 - 18:00</p>
              </div>
            </div>
            <a-button
              type="primary"
              size="large"
              block
              @click="handleContact"
              class="contact-btn"
            >
              Uchrashuv belgilash
            </a-button>
          </div>
        </a-col>
        <a-col :xs="24" :md="12">
          <div class="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.388619977531!2d69.24009431541826!3d41.31151707927092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sAmir%20Temur%20Square!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
              width="100%"
              height="400"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
            >
            </iframe>
          </div>
        </a-col>
      </a-row>
    </section>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'

  const services = ref([
    {
      id: 1,
      title: 'Diagnostika',
      description:
        "Zamonaviy uskunalar yordamida to'liq tibbiy tekshiruv va diagnostika xizmatlari",
      image:
        'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      title: 'Massaj Terapiyasi',
      description:
        "Professional massaj terapiyasi orqali tanangizni tinchlantirib, sog'lomlashtiring",
      image:
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      title: 'Stomatologiya',
      description:
        'Zamonaviy tish davolash, profilaktika va estetik stomatologiya xizmatlari',
      image:
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop',
    },
    {
      id: 4,
      title: 'Psixologik Yordam',
      description:
        'Tajribali psixologlar bilan konsultatsiya va psixoterapiya seanslar',
      image:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop',
    },
    {
      id: 5,
      title: 'Kardiologiya',
      description: 'Yurak-qon tomir kasalliklari diagnostikasi va davolash',
      image:
        'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&h=300&fit=crop',
    },
    {
      id: 6,
      title: 'Pediatriya',
      description: 'Bolalar uchun maxsus tibbiy xizmatlar va parvarishlash',
      image:
        'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop',
    },
    {
      id: 7,
      title: 'Laboratoriya',
      description: 'Barcha turdagi tibbiy tahlillar va tezkor natijalar',
      image:
        'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop',
    },
    {
      id: 8,
      title: 'Fizioterapiya',
      description: 'Zamonaviy fizioterapiya usullari bilan reabilitatsiya',
      image:
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    },
  ])

  const testimonials = ref([
    {
      id: 1,
      name: 'Aziza Karimova',
      service: 'Diagnostika xizmati',
      text: "Klinikada juda yaxshi xizmat ko'rsatildi. Shifokorlar juda e'tiborli va professional. Zamonaviy uskunalar yordamida diagnostika o'tkazildi va tez orada sog'ayib ketdim. Rahmat!",
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      name: 'Javohir Aliyev',
      service: 'Stomatologiya',
      text: "Tishlarimni davolash uchun bu klinikaga murojaat qildim. Juda og'riqsiz va professional xizmat. Stomatolog juda malakali va mehribon. Hammaga tavsiya qilaman!",
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      id: 3,
      name: 'Malika Rahimova',
      service: 'Psixologik yordam',
      text: "Psixolog bilan konsultatsiya juda foydali bo'ldi. Muammolarimni hal qilishda katta yordam berdi. Juda qulay muhit va professional yondashuv. Minnatdorman!",
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: 4,
      name: 'Sardor Usmanov',
      service: 'Kardiologiya',
      text: "Yurak muammolarim bilan bog'liq kompleks tekshiruvdan o'tdim. Shifokorlar ancha professional va diqqatli. Davolash rejasi juda samarali bo'ldi. Tavsiya qilaman!",
      avatar: 'https://i.pravatar.cc/150?img=13',
    },
  ])

  // Counter animation
  const animatedYears = ref(0)
  const animatedSpecialists = ref(0)
  const animatedPatients = ref(0)
  const statsRef = ref(null)
  let observer = null

  const animateCounter = (target, duration, callback) => {
    let start = 0
    const increment = target / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        callback(target)
        clearInterval(timer)
      } else {
        callback(Math.floor(start))
      }
    }, 16)
  }

  const startAnimateCounter = () => {
    animateCounter(15, 2000, (val) => (animatedYears.value = val))
    animateCounter(50, 2000, (val) => (animatedSpecialists.value = val))
    animateCounter(10000, 2500, (val) => (animatedPatients.value = val))
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && animatedYears.value === 0) {
            startAnimateCounter()
          }
        })
      },
      { threshold: 0.5 }
    )

    setTimeout(() => {
      const statsSection = document.querySelector('.about-stats')
      if (statsSection) {
        observer.observe(statsSection)
      }
    }, 100)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleContact = () => {
    alert(
      "Uchrashuv belgilash uchun +998 71 123 45 67 raqamiga qo'ng'iroq qiling yoki sahifamizdan ariza qoldiring!"
    )
  }
</script>

<style scoped>
  .home-page {
    width: 100%;
    overflow-x: hidden;
  }

  /* Hero Section */
  .hero-section {
    padding: 80px 5%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 600px;
    display: flex;
    align-items: center;
  }

  .hero-content {
    animation: fadeInUp 0.8s ease-out;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 20px;
    line-height: 1.2;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .hero-text {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.95);
    margin-bottom: 30px;
    line-height: 1.6;
  }

  .hero-buttons {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }

  .hero-btn-secondary {
    background: white;
    color: #1890ff;
    border: 2px solid white;
  }

  .hero-btn-secondary:hover {
    background: rgba(255, 255, 255, 0.9);
    color: #096dd9;
  }

  .hero-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .hero-image {
    animation: fadeInRight 0.8s ease-out;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    border: 4px solid rgba(255, 255, 255, 0.2);
  }

  .hero-image img {
    width: 100%;
    height: auto;
    display: block;
  }

  /* Services Section */
  .services-section {
    padding: 80px 5%;
    background: #f0f8ff;
  }

  .section-header {
    text-align: center;
    margin-bottom: 60px;
  }

  .section-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #0050b3;
    margin-bottom: 10px;
  }

  .section-subtitle {
    font-size: 1.1rem;
    color: #096dd9;
  }

  .service-card {
    height: 100%;
    border-radius: 15px;
    transition: all 0.3s ease;
    border: 2px solid #e6f7ff;
    overflow: hidden;
  }

  .service-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(24, 144, 255, 0.2);
    border-color: #1890ff;
  }

  .service-image {
    height: 200px;
    overflow: hidden;
  }

  .service-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .service-card:hover .service-image img {
    transform: scale(1.1);
  }

  /* About Section */
  .about-section {
    padding: 80px 5%;
    background: white;
  }

  .about-image {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 15px 40px rgba(24, 144, 255, 0.15);
    border: 3px solid #e6f7ff;
  }

  .about-image img {
    width: 100%;
    height: auto;
    display: block;
  }

  .about-content {
    padding: 20px 0;
  }

  .about-text {
    font-size: 1.05rem;
    color: #595959;
    line-height: 1.8;
    margin-bottom: 20px;
  }

  .about-stats {
    display: flex;
    gap: 30px;
    margin-top: 40px;
    flex-wrap: wrap;
  }

  .stat-item {
    text-align: center;
    flex: 1;
    min-width: 100px;
    padding: 20px;
    border-radius: 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: transform 0.3s ease;
  }

  .stat-item:hover {
    transform: translateY(-5px);
  }

  .stat-item h3 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 5px;
  }

  .stat-item p {
    font-size: 0.95rem;
    color: #ffffff;
    font-weight: 500;
  }

  /* Testimonials Section */
  .testimonials-section {
    padding: 80px 5%;
    background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%);
  }

  .testimonials-container {
    max-width: 1000px;
    margin: 0 auto;
    position: relative;
  }

  .testimonials-carousel {
    padding: 0 60px;
  }

  .custom-slick-arrow {
    width: 50px;
    height: 50px;
    display: flex !important;
    align-items: center;
    justify-content: center;
    background: #1890ff;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }

  .custom-slick-arrow:hover {
    background: #096dd9;
    transform: translateY(-50%) scale(1.1);
  }

  .arrow-icon {
    color: white;
    font-size: 30px;
    font-weight: bold;
    line-height: 1;
  }

  .testimonial-slide {
    padding: 20px;
  }

  .testimonial-card {
    border-radius: 20px;
    border: 2px solid #1890ff;
    box-shadow: 0 10px 30px rgba(24, 144, 255, 0.15);
  }

  .testimonial-content {
    padding: 20px;
    text-align: center;
  }

  .quote-icon {
    font-size: 4rem;
    color: #1890ff;
    opacity: 0.3;
    line-height: 1;
  }

  .testimonial-text {
    font-size: 1.1rem;
    color: #262626;
    line-height: 1.8;
    margin: 20px 0 30px;
    font-style: italic;
  }

  .testimonial-author {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }

  .author-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #1890ff;
  }

  .author-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .testimonial-author h4 {
    margin: 0;
    font-size: 1.1rem;
    color: #0050b3;
    font-weight: 600;
  }

  .testimonial-author p {
    margin: 5px 0 0;
    font-size: 0.9rem;
    color: #096dd9;
  }

  /* Contact Section */
  .contact-section {
    padding: 80px 5%;
    background: white;
  }

  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .contact-item {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }

  .contact-icon {
    font-size: 2rem;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    border-radius: 15px;
    flex-shrink: 0;
  }

  .contact-item h4 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #0050b3;
    margin-bottom: 8px;
  }

  .contact-item p {
    color: #595959;
    margin: 0;
    line-height: 1.6;
  }

  .contact-btn {
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    border: none;
    height: 50px;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .contact-btn:hover {
    background: linear-gradient(135deg, #096dd9 0%, #0050b3 100%);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(24, 144, 255, 0.3);
  }

  .map-container {
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(24, 144, 255, 0.15);
    border: 3px solid #e6f7ff;
  }

  /* Animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Carousel dots styling */
  :deep(.ant-carousel .slick-dots li button) {
    background: #1890ff;
    opacity: 0.3;
  }

  :deep(.ant-carousel .slick-dots li.slick-active button) {
    background: #1890ff;
    opacity: 1;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }

    .hero-text {
      font-size: 1rem;
    }

    .section-title {
      font-size: 1.8rem;
    }

    .hero-section {
      padding: 40px 5%;
    }

    .services-section,
    .about-section,
    .testimonials-section,
    .contact-section {
      padding: 50px 5%;
    }

    .about-stats {
      justify-content: center;
    }

    .testimonials-carousel {
      padding: 0 20px;
    }

    .custom-slick-arrow {
      width: 40px;
      height: 40px;
    }

    .custom-slick-arrow[style*='left'] {
      left: -10px !important;
    }

    .custom-slick-arrow[style*='right'] {
      right: -10px !important;
    }
  }

  @media (max-width: 480px) {
    .hero-buttons {
      flex-direction: column;
      width: 100%;
    }

    .hero-buttons button {
      width: 100%;
    }

    .stat-item h3 {
      font-size: 2rem;
    }
  }
</style>

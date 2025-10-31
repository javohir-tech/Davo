<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Footer Top Section -->
      <div class="footer-top">
        <!-- Brand Section -->
        <div class="footer-section brand-section">
          <div class="footer-brand">
            <img
              src="../../assets/wlogo.png"
              alt="DAVO.UZ"
              class="footer-logo"
            />
          </div>
          <p class="footer-description">
            Onlayn konsultatsiya va dori-darmonlar yetkazib berish xizmati.
            Sog'lig'ingiz - bizning g'amxo'rligimiz!
          </p>
          <div class="social-links">
            <a
              href="https://www.instagram.com/suvonov_javohir1/#"
              target="_blank"
              rel="noopener"
              class="social-link instagram"
            >
              <InstagramOutlined />
            </a>
            <a
              href="https://t.me/Suvonov_Javoh1r"
              target="_blank"
              rel="noopener"
              class="social-link telegram"
            >
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z'/%3E%3C/svg%3E"
                alt="Telegram"
              />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener"
              class="social-link facebook"
            >
              <FacebookOutlined />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h3 class="footer-title">Tezkor havolalar</h3>
          <ul class="footer-links">
            <li><RouterLink to="/">Bosh sahifa</RouterLink></li>
            <li><RouterLink to="/doctors">Shifokorlar</RouterLink></li>
            <li><RouterLink to="/drugs">Dorilar</RouterLink></li>
            <li><RouterLink to="/diagnostics">Xizmatlar</RouterLink></li>
          </ul>
        </div>

        <!-- Services -->
        <div class="footer-section">
          <h3 class="footer-title">Xizmatlar</h3>
          <ul class="footer-links">
            <li><a href="#consultations">Onlayn konsultatsiya</a></li>
            <li><a href="#pharmacy">Dori-darmonlar</a></li>
            <li><a href="#delivery">Yetkazib berish</a></li>
            <li><a href="#support">Yordam markazi</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-section">
          <h3 class="footer-title">Bog'lanish</h3>
          <ul class="footer-contact">
            <li>
              <PhoneOutlined class="contact-icon" />
              <span>+998 (90) 123-45-67</span>
            </li>
            <li>
              <MailOutlined class="contact-icon" />
              <span>info@davo.uz</span>
            </li>
            <li>
              <EnvironmentOutlined class="contact-icon" />
              <span>Toshkent, O'zbekiston</span>
            </li>
            <li>
              <ClockCircleOutlined class="contact-icon" />
              <span>Dush-Yak: 9:00 - 18:00</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="footer-divider"></div>
        <div class="footer-bottom-content">
          <p class="copyright">
            © {{ currentYear }} DAVO.UZ. Barcha huquqlar himoyalangan.
          </p>
          <p class="developer">
            <CodeOutlined class="code-icon" />
            <span>Dasturchi:</span>
            <a
              href="https://www.instagram.com/javohir_suvonov"
              target="_blank"
              rel="noopener"
              class="developer-link"
            >
              Suvonov Javohir
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
  import { computed } from 'vue'
  import {
    InstagramOutlined,
    FacebookOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    CodeOutlined,
  } from '@ant-design/icons-vue'

  const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
  .footer {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: #ecf0f1;
    margin-top: 60px;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  }

  .footer-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 60px 24px 24px;
  }

  /* Footer Top Section */
  .footer-top {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 48px;
    margin-bottom: 48px;
  }

  /* Brand Section */
  .brand-section {
    max-width: 400px;
  }

  .footer-brand {
    margin-bottom: 20px;
  }

  .footer-logo {
    width: 140px;
    height: auto;
    filter: drop-shadow(0 2px 8px rgba(255, 255, 255, 0.1));
  }

  .footer-description {
    color: #bdc3c7;
    font-size: 14px;
    line-height: 1.8;
    margin-bottom: 24px;
  }

  .social-links {
    display: flex;
    gap: 12px;
  }

  .social-link {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }

  .social-link img {
    width: 24px;
    height: 24px;
  }

  .social-link.instagram {
    background: linear-gradient(
      45deg,
      #f09433 0%,
      #e6683c 25%,
      #dc2743 50%,
      #cc2366 75%,
      #bc1888 100%
    );
  }

  .social-link.instagram:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(240, 148, 51, 0.4);
  }

  .social-link.telegram {
    background: linear-gradient(135deg, #0088cc 0%, #00a3e0 100%);
  }

  .social-link.telegram:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 136, 204, 0.4);
  }

  .social-link.facebook {
    background: linear-gradient(135deg, #1877f2 0%, #0c63d4 100%);
  }

  .social-link.facebook:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(24, 119, 242, 0.4);
  }

  /* Footer Sections */
  .footer-section {
    display: flex;
    flex-direction: column;
  }

  .footer-title {
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 12px;
  }

  .footer-title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #3498db 0%, #2980b9 100%);
    border-radius: 2px;
  }

  .footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-links li {
    margin-bottom: 12px;
  }

  .footer-links a {
    color: #bdc3c7;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.3s ease;
    display: inline-block;
    position: relative;
    padding-left: 16px;
  }

  .footer-links a::before {
    content: '→';
    position: absolute;
    left: 0;
    opacity: 0;
    transition: all 0.3s ease;
  }

  .footer-links a:hover {
    color: #3498db;
    padding-left: 20px;
  }

  .footer-links a:hover::before {
    opacity: 1;
  }

  /* Contact Section */
  .footer-contact {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-contact li {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    color: #bdc3c7;
    font-size: 14px;
  }

  .contact-icon {
    color: #3498db;
    font-size: 18px;
    flex-shrink: 0;
  }

  /* Footer Bottom */
  .footer-divider {
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    margin-bottom: 24px;
  }

  .footer-bottom-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .copyright {
    color: #95a5a6;
    font-size: 14px;
    margin: 0;
  }

  .developer {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #95a5a6;
    font-size: 14px;
    margin: 0;
  }

  .code-icon {
    color: #3498db;
    font-size: 16px;
  }

  .developer-link {
    color: #3498db;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    position: relative;
  }

  .developer-link::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 0;
    height: 2px;
    background: #3498db;
    transition: width 0.3s ease;
  }

  .developer-link:hover {
    color: #2980b9;
  }

  .developer-link:hover::after {
    width: 100%;
  }

  /* Responsive Design */
  @media (max-width: 1200px) {
    .footer-top {
      grid-template-columns: 2fr 1fr 1fr;
      gap: 40px;
    }

    .brand-section {
      grid-column: 1 / -1;
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .footer-container {
      padding: 48px 20px 20px;
    }

    .footer-top {
      grid-template-columns: 1fr;
      gap: 32px;
      margin-bottom: 32px;
    }

    .brand-section {
      text-align: center;
      margin: 0 auto;
    }

    .footer-brand {
      display: flex;
      justify-content: center;
    }

    .footer-logo {
      width: 120px;
    }

    .social-links {
      justify-content: center;
    }

    .footer-title {
      text-align: center;
    }

    .footer-title::after {
      left: 50%;
      transform: translateX(-50%);
    }

    .footer-links,
    .footer-contact {
      text-align: center;
    }

    .footer-links a {
      padding-left: 0;
    }

    .footer-links a:hover {
      padding-left: 0;
    }

    .footer-links a::before {
      display: none;
    }

    .footer-contact li {
      justify-content: center;
    }

    .footer-bottom-content {
      flex-direction: column;
      text-align: center;
    }

    .developer {
      justify-content: center;
    }
  }

  @media (max-width: 576px) {
    .footer-container {
      padding: 40px 16px 16px;
    }

    .footer-logo {
      width: 100px;
    }

    .footer-title {
      font-size: 16px;
    }

    .social-link {
      width: 40px;
      height: 40px;
      font-size: 18px;
    }

    .social-link img {
      width: 20px;
      height: 20px;
    }

    .footer-description {
      font-size: 13px;
    }

    .footer-links a,
    .footer-contact li,
    .copyright,
    .developer {
      font-size: 13px;
    }
  }

  /* Animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .footer-section {
    animation: fadeInUp 0.6s ease-out;
    animation-fill-mode: both;
  }

  .footer-section:nth-child(1) {
    animation-delay: 0.1s;
  }
  .footer-section:nth-child(2) {
    animation-delay: 0.2s;
  }
  .footer-section:nth-child(3) {
    animation-delay: 0.3s;
  }
  .footer-section:nth-child(4) {
    animation-delay: 0.4s;
  }
</style>

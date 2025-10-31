<template>
  <div class="article-detail-page">
    <!-- Yuklash holati -->
    <a-spin v-if="loading" size="large" class="page-spinner" />

    <!-- Maqola kontenti -->
    <div v-else-if="dataById && !loading" class="article-container">
      <!-- Orqaga qaytish tugmasi -->
      <a-button type="link" @click="goBack" class="back-button">
        <template #icon>
          <ArrowLeftOutlined />
        </template>
        Orqaga qaytish
      </a-button>

      <!-- Maqola sarlavhasi va asosiy ma'lumotlar -->
      <div class="article-header">
        <a-tag
          :color="getCategoryColor(dataById.category)"
          class="category-tag"
        >
          {{ dataById.category }}
        </a-tag>
        <h1 class="article-title">{{ dataById.title }}</h1>
        <p class="article-description">{{ dataById.description }}</p>

        <div class="article-meta">
          <span class="meta-item">
            <CalendarOutlined />
            {{ formatDate(dataById.date) }}
          </span>
          <span class="meta-item">
            <ClockCircleOutlined />
            {{ readingTime }} daqiqa o'qish
          </span>
        </div>
      </div>

      <!-- Maqola rasmi -->
      <div class="article-image-container">
        <img
          :src="dataById.image"
          :alt="dataById.title"
          class="article-image"
        />
      </div>

      <!-- Asosiy kontent -->
      <div class="article-content">
        <a-card :bordered="false" class="content-card">
          <div v-html="formattedContent" class="content-text"></div>
        </a-card>

        <!-- Maslahatlar bo'limi -->
        <a-card
          v-if="dataById.tips && dataById.tips.length"
          title="Foydali maslahatlar"
          class="tips-card"
        >
          <template #extra>
            <BulbOutlined style="font-size: 20px; color: #faad14" />
          </template>
          <a-list :data-source="dataById.tips" :split="false">
            <template #renderItem="{ item, index }">
              <a-list-item class="tip-item">
                <a-typography-text>
                  <span class="tip-number">{{ index + 1 }}.</span>
                  {{ item }}
                </a-typography-text>
              </a-list-item>
            </template>
          </a-list>
        </a-card>

        <!-- Tashqi havolalar -->
        <a-card
          v-if="dataById.externalLinks && dataById.externalLinks.length"
          title="Qo'shimcha ma'lumotlar"
          class="links-card"
        >
          <template #extra>
            <LinkOutlined style="font-size: 20px; color: #1890ff" />
          </template>
          <a-space direction="vertical" :size="12" style="width: 100%">
            <a
              v-for="link in dataById.externalLinks"
              :key="link.url"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="external-link"
            >
              <GlobalOutlined />
              {{ link.title }}
              <ExportOutlined style="font-size: 12px; margin-left: 4px" />
            </a>
          </a-space>
        </a-card>
      </div>
    </div>

    <!-- Xatolik holati -->
    <a-result
      v-else
      status="404"
      title="Maqola topilmadi"
      sub-title="Kechirasiz, siz qidirayotgan maqola mavjud emas."
    >
      <template #extra>
        <a-button type="primary" @click="goBack">
          Bosh sahifaga qaytish
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import {
    ArrowLeftOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    BulbOutlined,
    LinkOutlined,
    GlobalOutlined,
    ExportOutlined,
  } from '@ant-design/icons-vue'
  //Hooks
  import useDocs from '@/Hooks/useDocs'

  const { loading, dataById, getDocumentById } = useDocs('articles')

  const route = useRoute()
  const router = useRouter()

  const article = ref(null)

  // Maqolani yuklash
  const loadArticle = () => {
    article.value = articles[0]
  }

  // Kategoriya rangini aniqlash
  const getCategoryColor = (category) => {
    const colors = {
      Kardiologiya: 'red',
      Dietologiya: 'green',
      Psixologiya: 'purple',
      Endokrinologiya: 'orange',
      Immunologiya: 'blue',
    }
    return colors[category] || 'default'
  }

  // Sanani formatlash
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('uz-UZ', options)
  }

  // O'qish vaqtini hisoblash
  const readingTime = computed(() => {
    if (!article.value) return 0
    const wordsPerMinute = 200
    const wordCount = article.value.fullContent.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  })

  // Kontentni HTML formatida qaytarish
  const formattedContent = computed(() => {
    if (!dataById.value) return ''
    return dataById.value.fullContent
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.*)$/gm, '<p>$1</p>')
      .replace(/<p><\/p>/g, '')
  })

  // Orqaga qaytish
  const goBack = () => {
    router.go(-1)
  }

  // Komponent yuklanganida
  onMounted(() => {
    getDocumentById(route.params.id)
  })
</script>

<style scoped>
  .article-detail-page {
    min-height: 100vh;
    background: #f5f5f5;
    padding: 24px;
  }

  .page-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }

  .article-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .back-button {
    margin-bottom: 24px;
    padding-left: 0;
    font-size: 16px;
  }

  .article-header {
    background: white;
    padding: 32px;
    border-radius: 8px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .category-tag {
    font-size: 14px;
    padding: 4px 12px;
    margin-bottom: 16px;
  }

  .article-title {
    font-size: 36px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 16px 0;
    line-height: 1.3;
  }

  .article-description {
    font-size: 18px;
    color: #666;
    margin-bottom: 24px;
    line-height: 1.6;
  }

  .article-meta {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #999;
    font-size: 14px;
  }

  .article-image-container {
    margin-bottom: 24px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .article-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    display: block;
  }

  .article-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .content-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .content-text {
    font-size: 16px;
    line-height: 1.8;
    color: #333;
  }

  .content-text :deep(p) {
    margin-bottom: 16px;
  }

  .content-text :deep(strong) {
    font-weight: 600;
    color: #1a1a1a;
  }

  .tips-card,
  .links-card,
  .related-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .tip-item {
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .tip-item:last-child {
    border-bottom: none;
  }

  .tip-number {
    display: inline-block;
    width: 24px;
    height: 24px;
    background: #1890ff;
    color: white;
    border-radius: 50%;
    text-align: center;
    line-height: 24px;
    font-size: 12px;
    margin-right: 12px;
    font-weight: 600;
  }

  .external-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 6px;
    transition: all 0.3s;
    color: #1890ff;
    text-decoration: none;
  }

  .external-link:hover {
    background: #e6f7ff;
    transform: translateX(4px);
  }

  .related-article-card {
    height: 100%;
    transition: all 0.3s;
  }

  .related-article-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .related-article-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .related-article-title {
    margin: 8px 0;
    font-size: 16px;
    color: #1a1a1a;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    .article-detail-page {
      padding: 16px;
    }

    .article-header {
      padding: 24px 16px;
    }

    .article-title {
      font-size: 28px;
    }

    .article-description {
      font-size: 16px;
    }

    .article-image {
      height: 250px;
    }

    .content-text {
      font-size: 15px;
    }
  }
</style>

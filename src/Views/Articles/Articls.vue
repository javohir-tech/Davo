<template>
  <div class="articles-container">
    <!-- Articles Header Section -->
    <div class="header-section">
      <Title :level="2" class="page-title">
        <span class="header-icon">
          <ReadOutlined />
        </span>
        Maqolalar
      </Title>
      <p class="header-subtitle">
        Sog'liginizni asrash uchun mutahasislarimiz tomonidan berilgan tavsiyalar bilan tanishib chiqishing
      </p>
    </div>

    <!-- Articles Search Section-->
    <div class="search-section">
      <Input @pressEnter="onSearchEnter" size="large" v-model:value="searchQuery" allowClear class="search-input"
        placeholder="Sizni qiziqtirgan mavzu nomini yozing...">
      <template #prefix>
        <SearchOutlined class="search-icon" />
      </template>
      </Input>
      <div v-if="searchQuery" class="filtered-count">
        <p>{{ filteredArticles.length }} ta maqola topildi</p>
      </div>
    </div>

    <!-- Articles Section -->
    <Row :gutter="[16, 16]" class="articles-section">
      <Col v-for="article in paginatedArticles" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
      <Card hoverable class="article-card">
        <template #cover>
          <div class="article-cover">
            <div class="category-tag">{{ article.category }}</div>
          </div>
        </template>
        <CardMeta>
          <template #title>
            <div class="">{{ article.title }}</div>
          </template>
          <template #description>
            <div class="article-content">
              <p class="article-description">{{ article.description }}</p>
              <div class="article-footer">
                <span class="article-date">
                  <CalendarOutlined />
                  {{ article.date }}
                </span>
                <Button type="primary" @click="navigateArticle(article.id)">
                  Batafsil
                </Button>
              </div>
            </div>
          </template>
        </CardMeta>
      </Card>
      </Col>
    </Row>

    <!-- Pagination Section -->
    <div class="pagination-section">
      <Pagination :current="currentPage" :pageSize="pageSize" :total="filteredArticles.length" @change="onPageChange" />
    </div>
  </div>
</template>

<script setup>
//Vue
import { computed, ref, watch } from 'vue';
//Antd Components
import { Typography, Input, Row, Col, Card, CardMeta, Button, Pagination, message } from 'ant-design-vue';
//Antd Styles
import { ReadOutlined, SearchOutlined, CalendarOutlined } from '@ant-design/icons-vue'
// Articles
import articles from '@/Data/articles.json'

const { Title } = Typography
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(6);

//Computents
const filteredArticles = computed(() => {
  if (!searchQuery) return articles;
  return articles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.value.toLocaleLowerCase()) ||
    a.category.toLocaleLowerCase().includes(searchQuery.value.toLocaleLowerCase())
  )
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredArticles.value.slice(start, pageSize.value + start)
})

//methods
function onPageChange(page) {
  currentPage.value = page;
  window.scroll({ top: 0, behavior: 'smooth' })
}

function navigateArticle(id) {
  // message.success(`${id} idli maqolaga otildi`)
}

function onSearchEnter() {
  currentPage.value = 1
}

watch(searchQuery, () => {
  currentPage.value = 1
})

</script>

<style scoped>
/* Header Section */
.articles-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: #f0f2f5;
  height: 100%;
}

.header-section,
.search-section,
.pagination-section {
  padding: 32px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-radius: 15px;
  margin-bottom: 16px;
}

.page-title {
  margin: 0 !important;
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  font-weight: 700;
  gap: 12px;
  color: #667eea;
}

.header-icon {
  font-size: 32px;
}

.header-subtitle {
  margin: 8px 10px 0px 48px;
  color: #8c8c8c;
  font-size: 14px;
}

/* Search Section */

.search-input {
  max-width: 500px;
}

.search-icon {
  color: #1890ff;
  font-size: 18px;
}

.filtered-count {
  p {
    font-size: 14px;
    margin-top: 10px;
    margin-bottom: 0;
    font-weight: 500;
    color: #52c41a;
  }
}

/* Cards Section */
.articles-section {
  margin-bottom: 15px;
}

.article-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}


.article-cover {
  height: 180px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 16px;
}

.category-tag {
  background: rgba(255, 255, 255, 0.95);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #667eea;
}

.article-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
  line-height: 1.4;
  min-height: 50px;
}

.article-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-description {
  color: #595959;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  min-height: 80px;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: solid 1px #f0f0f0;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding: 20px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .articles-page {
    padding: 16px;
  }

  .page-title {
    font-size: 28px;
  }

  .header-subtitle {
    font-size: 14px;
  }

  .article-cover {
    height: 150px;
  }

  .article-title {
    font-size: 16px;
    min-height: auto;
  }

  .article-description {
    min-height: auto;
  }
}

@media (max-width: 576px) {
  .header-subtitle {
    font-size: 12px;
  }

  .article-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .article-footer :deep(.ant-btn) {
    width: 100%;
  }
}
</style>
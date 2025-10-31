<template>
  <div style="background: #f0f2f5">
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
          Sog'liginizni asrash uchun mutahasislarimiz tomonidan berilgan
          tavsiyalar bilan tanishib chiqishing
        </p>
      </div>

      <!-- Articles Search Section-->
      <div class="search-section">
        <Input ref="searchInput" @pressEnter="onSearchEnter" size="large" v-model:value="searchQuery" allowClear
          class="search-input" placeholder="Sizni qiziqtirgan mavzu nomini yozing...">
        <template #prefix>
          <SearchOutlined class="search-icon" />
        </template>
        <template #suffix>
          <p class="ctrl">Ctrl+K</p>
        </template>
        </Input>
        <div v-if="searchQuery" class="filtered-count">
          <p>{{ filteredArticles.length }} ta maqola topildi</p>
        </div>
      </div>

      <!-- Articles Section -->
      <div v-if="loading" class="loading">
        <a-spin size="large" tip="Maqolalar yuklanmoqda..." />
      </div>
      <div v-else-if="!loading && data.length === 0" class="empty">
        <a-empty>
          <p>Maqolalar Yuklanmadi</p>
          <a-button type="primary" @click="Reload">Reload</a-button>
        </a-empty>
      </div>
      <div v-else-if="!loading && data.length > 0">
        <Row :gutter="[16, 16]" class="articles-section">
          <Col v-for="article in paginatedArticles" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <Card hoverable class="article-card">
            <template #cover>
              <div class="article-cover">
                <img :src="article.image" alt="article image">
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
                    <RouterLink :to="`/articles/${article.id}`">
                      <Button type="primary" @click="navigateArticle(article.id)">
                        Batafsil
                      </Button>
                    </RouterLink>
                  </div>
                </div>
              </template>
            </CardMeta>
          </Card>
          </Col>
        </Row>

        <!-- Pagination Section -->
        <div class="pagination-section">
          <Pagination :current="currentPage" :pageSize="pageSize" :total="filteredArticles.length"
            @change="onPageChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
//Vue
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
//Antd Components
import {
  Typography,
  Input,
  Row,
  Col,
  Card,
  CardMeta,
  Button,
  Pagination,
} from 'ant-design-vue'
//Antd Styles
import {
  ReadOutlined,
  SearchOutlined,
  CalendarOutlined,
} from '@ant-design/icons-vue'
//Hooks
import useDocs from '@/Hooks/useDocs'

const { loading, data, getData } = useDocs('articles')

const { Title } = Typography
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(6)
const searchInput = ref(null)

//Computents
const filteredArticles = computed(() => {
  if (!searchQuery) return data
  return data.value.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.value.toLocaleLowerCase()) ||
      a.category
        .toLocaleLowerCase()
        .includes(searchQuery.value.toLocaleLowerCase())
  )
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredArticles.value.slice(start, pageSize.value + start)
})

//methods
function onPageChange(page) {
  currentPage.value = page
  window.scroll({ top: 0, behavior: 'smooth' })
}

const Reload = () => {
  window.location.reload()
}

function navigateArticle(id) {

}

function onSearchEnter() {
  currentPage.value = 1
}

function handleShortcut(e) {
  if (e.ctrlKey && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchInput.value?.focus()
  }
}

watch(searchQuery, () => {
  currentPage.value = 1
})


onMounted(() => {
  getData()
  window.addEventListener('keydown', handleShortcut)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleShortcut)
})
</script>

<style scoped>
/* Accissibilty */
.ctrl {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
  font-weight: 500;
}

/* Header Section */

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.empty {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.articles-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
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
  color: #1890ff;
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

  img {
    transform: scale(1.1);
  }
}

.article-cover {
  height: 180px;
  overflow: hidden;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: all 0.3s ease;
  }
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

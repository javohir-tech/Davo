<template>
  <div class="articles-page">
    <div class="page-header">
      <h1 class="page-title">Tibbiy Maqolalar</h1>
      <p class="page-subtitle">Sog'liqni saqlash va kasalliklarga qarshi kurashish bo'yicha foydali ma'lumotlar</p>
    </div>

    <!-- Qidiruv inputi -->
    <div class="search-section">
      <a-input-search
        v-model:value="searchQuery"
        placeholder="Maqolalarni qidirish..."
        size="large"
        :prefix="h(SearchOutlined)"
        @search="onSearch"
        allow-clear
      />
    </div>

    <!-- Maqolalar ro'yxati -->
    <a-row :gutter="[24, 24]" class="articles-grid">
      <a-col
        v-for="article in paginatedArticles"
        :key="article.id"
        :xs="24"
        :sm="24"
        :md="12"
        :lg="8"
        :xl="8"
      >
        <a-card hoverable class="article-card">
          <template #cover>
            <div class="article-cover">
              <div class="category-tag">{{ article.category }}</div>
            </div>
          </template>
          <a-card-meta>
            <template #title>
              <div class="article-title">{{ article.title }}</div>
            </template>
            <template #description>
              <div class="article-content">
                <p class="article-description">{{ article.description }}</p>
                <div class="article-footer">
                  <span class="article-date">
                    <CalendarOutlined />
                    {{ formatDate(article.date) }}
                  </span>
                  <a-button type="primary" @click="viewArticle(article.title)">
                    Batafsil
                  </a-button>
                </div>
              </div>
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>

    <!-- Natija topilmasa -->
    <a-empty
      v-if="filteredArticles.length === 0"
      description="Maqolalar topilmadi"
      class="empty-state"
    />

    <!-- Pagination -->
    <div v-if="filteredArticles.length > 0" class="pagination-section">
      <a-pagination
        v-model:current="currentPage"
        :total="filteredArticles.length"
        :page-size="pageSize"
        :show-size-changer="false"
        :show-total="(total) => `Jami ${total} ta maqola`"
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue';
import { SearchOutlined, CalendarOutlined } from '@ant-design/icons-vue';
//Data
import articles from '@/Data/articles.json'

// State
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = 6;

// Filtrlanган maqolalar
const filteredArticles = computed(() => {
  if (!searchQuery.value) {
    return articles;
  }
  
  const query = searchQuery.value.toLowerCase();
  return articles.filter(article => 
    article.title.toLowerCase().includes(query) ||
    article.description.toLowerCase().includes(query) ||
    article.category.toLowerCase().includes(query)
  );
});

// Sahifaga ko'ra maqolalar
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredArticles.value.slice(start, end);
});

// Funksiyalar
const onSearch = () => {
  currentPage.value = 1;
};

const onPageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const viewArticle = (title) => {
  console.log('Maqola nomi:', title);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('uz-UZ', options);
};
</script>

<style scoped>
.articles-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 16px;
  color: #8c8c8c;
}

.search-section {
  margin-bottom: 32px;
}

.articles-grid {
  margin-bottom: 32px;
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
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.article-date {
  color: #8c8c8c;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding: 20px 0;
}

.empty-state {
  margin: 60px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .articles-page {
    padding: 16px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
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
  .page-title {
    font-size: 24px;
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
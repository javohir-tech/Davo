import { createRouter, createWebHistory } from 'vue-router'
//Layout
import MainLayout from '@/Layout/MainLayout.vue'
//Views
import {
  Articls,
  Diagnostics,
  Doctors,
  Drugs,
  HomeView,
  Institution,
  Intervyu,
  Medicine,
  Profile,
  Shop,
  Orders,
  DoctorProfile,
  Consultations,
  Article,
} from '@/Views'
//Auth
import { Login, Register } from '@/Auth'

//User Store
import { useUsersStore } from '@/Store/useUserStore'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        component: HomeView,
      },
      {
        path: 'drugs',
        component: Drugs,
      },
      {
        path: 'drugs/:id',
        component: Medicine,
      },
      {
        path: 'doctors',
        component: Doctors,
      },
      {
        path: 'doctors/:id',
        component: DoctorProfile,
      },
      {
        path: 'institution',
        component: Institution,
      },
      {
        path: 'diagnostics',
        component: Diagnostics,
      },
      {
        path: 'articls',
        component: Articls,
      },
      {
        path: 'articles/:id',
        component: Article,
      },
      {
        path: 'profile',
        component: Profile,
      },
      {
        path: 'shop',
        component: Shop,
      },
      {
        path: 'orders',
        component: Orders,
      },
      {
        path: 'consultations',
        component: Consultations,
      },
      {
        path: 'intervyu',
        component: Intervyu,
      },
      {
        path: 'register',
        component: Register,
      },
      {
        path: 'login',
        component: Login,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, form, next) => {
  const authPages = ['/login', '/register']
  const userPages = ['/profile', '/shop', '/orders', '/consultations']
  const userStore = useUsersStore()
  const user = userStore.isActive

  if (user && authPages.includes(to.path)) {
    next('/')
  }

  if (!user && userPages.includes(to.path)) {
    next('/')
  }

  next()
})

export { router }

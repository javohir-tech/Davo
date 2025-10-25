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
} from '@/Views'
//Auth
import { Login, Register } from '@/Auth'

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
        path: 'doctors',
        component: Doctors,
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

export { router }

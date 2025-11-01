import { defineStore } from 'pinia'
//Firebase
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/FireBase/config'
//userStore
import { useUsersStore } from './useUserStore'
import { message } from 'ant-design-vue'

export const useUserConsultations = defineStore('consultations', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count += 1
    },
    decrement() {
      this.count -= 1
    },
    async fetchCount() {
      const userStore = useUsersStore()
      if (!userStore.isActive && !localStorage.getItem('token')) return
      try {
        const response = await getDoc(doc(db, 'users', userStore.uid))
        const userConsultations = response.data()?.userConsultations
        console.log(userConsultations)
        if (userConsultations) {
          this.count = userConsultations.length
        }
      } catch (error) {
        message.error('kasultatsiyalar yuklanmadi')
      }
    },
  },
})

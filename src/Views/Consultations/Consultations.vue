<template>
    <div v-if="loading">
        <a-spin size="large" />
    </div>
    <div v-if="error">
        <a-empty>

        </a-empty>
    </div>
    <div>
        consultatsiyalar
    </div>

</template>
<script setup>
//Vue
import { onMounted, ref, toRaw } from 'vue';
//Firebase
import { db } from '@/FireBase/config'
import { doc, getDoc } from 'firebase/firestore'
//userStore
import { useUsersStore } from '@/Store/useUserStore'

const userStore = useUsersStore();
const userId = userStore.uid

const loading = ref(false)
const consultaions = ref([])
const error = ref(false)

const getUSerConsultations = async () => {
    loading.value = true
    try {

        const response = await getDoc(doc(db, 'users', userId))
        const userConsultations = response.data().consultations
        console.log(userConsultations)
    } catch (error) {
        console.log(error)
        error.value = true
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    getUSerConsultations()
})
</script>
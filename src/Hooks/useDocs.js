//Vue
import { ref } from 'vue'
//Firebaasse
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/FireBase/config'
//Antd
import { message } from 'ant-design-vue'

export default function useDocs(collectionName) {
  const data = ref([])
  const loading = ref(false)

  async function getData() {
    loading.value = true
    try {
      const querySnapshot = await getDocs(collection(db, collectionName))
      data.value = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        }
      })
    } catch (error) {
      message.error(error.message)
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    getData,
  }
}

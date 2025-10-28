//Vue
import { ref } from 'vue'
//Firebaasse
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
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

  async function getDocumentById(collectionName, docId) {
    loading.value = true;
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        data.value = docSnap.data();
        console.log(data.value)
      } else {
        console.log('No such document');
        return null;
      }
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    getData,
    getDocumentById
  }
}

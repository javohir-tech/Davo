import { message } from "ant-design-vue";
import { defineStore } from "pinia";
//userStore
import { useUsersStore } from "./useUserStore";
//Firebase
import { db } from "@/FireBase/config";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
//Hook
import useDocs from "@/Hooks/useDocs";

export const useDrugsStore = defineStore('drugs', {
    state: () => ({
        selectedDrugs: [],
        selectedCount: 0,
        loadingItems: {}
    }),
    actions: {
        async fetchSelectedDrugs() {
            try {
                const { data, getData } = useDocs('selectedMedicines')
                await getData();
                this.selectedDrugs = data.value
                this.selectedCount = data.value.reduce((acc, curr) => acc + curr.quantity, 0)
            } catch (error) {
                console.log(error)
            }
        },
        async addDrug(drug) {
            this.loadingItems[drug.id] = true;
            try {
                const userStore = useUsersStore();
                if (userStore.isActive) {
                    await setDoc(doc(db, 'selectedMedicines', drug.id), { ...drug, quantity: 1 })
                    message.success(`${drug.name} savatga qo'shildi`);
                    this.selectedDrugs.push({ ...drug, quantity: 1 });

                    this.selectedCount += 1;
                } else {
                    message.info('Ro\'yhatdan o\'ting')
                }
            } catch (error) {
                message.error('Qayta urunip ko\'ring')
                console.log(error.code)
            } finally {
                this.loadingItems[drug.id] = false
            }
        },
        async removeDrug(drugId) {
            this.loadingItems[drugId] = true;
            try {
                const drug = this.selectedDrugs.find(drug => drug.id === drugId)
                this.selectedDrugs = this.selectedDrugs.filter(drug => drug.id !== drugId);
                message.info('Savatdan olindi')
                if (drug) {
                    await deleteDoc(doc(db, 'selectedMedicines', drugId))
                    const quantity = drug.quantity
                    this.selectedCount -= quantity
                }
            } catch (error) {
                console.log(error)
                message.error('Qayta urunip ko\'ring')
            } finally {
                this.loadingItems[drugId] = false;
            }
        },
        async incrementQuantity(drugId) {
            const drug = this.selectedDrugs.find(drug => drug.id === drugId);
            if (drug) {
                drug.quantity += 1;
                this.selectedCount += 1
                await updateDoc(doc(db, 'selectedMedicines', drugId), {
                    quantity: drug.quantity
                })
            }
        },
        async decrementQuantity(drugId) {
            const drug = this.selectedDrugs.find(drug => drug.id === drugId);
            if (drug && drug.quantity >= 0) {
                drug.quantity -= 1;
                this.selectedCount -= 1
                await updateDoc(doc(db, 'selectedMedicines', drugId), {
                    quantity: drug.quantity
                })
            }
        },
        getQuantity(drugId) {
            const drug = this.selectedDrugs.find(drug => drug.id === drugId)
            if (drug) {
                return drug.quantity
            }
        },
        async clearList() {
            this.selectedDrugs = [];
            this.selectedCount = 0
            const querySnapshot = await getDocs(collection(db, 'selectedMedicines'))
            const deletePromises = querySnapshot.docs.map((document) => {
                deleteDoc(doc(db, 'selectedMedicines', document.id))
            })
            await Promise.all(deletePromises)
        },
        isSelected(id) {
            if (this.getQuantity(id) === 0) {
                this.removeDrug(id)
                return false;
            }
            return this.selectedDrugs.some(drug => drug.id === id)
        }
    }
})
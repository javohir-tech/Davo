import { message } from "ant-design-vue";
import { defineStore } from "pinia";

//userStore
import { useUsersStore } from "./useUserStore";

export const useDrugsStore = defineStore('drugs', {
    state: () => ({
        selectDrugs: [],
    }),
    actions: {
        addDrug(drug) {
            const userStore = useUsersStore();
            if (userStore.isActive) {
                message.success(`${drug.name} savatga qo'shildi`);
                this.selectDrugs.push({ ...drug, quantity: 1 });
            } else {    
                message.info('Ro\'yhatdan o\'ting')
            }
        },
        removeDrug(drugId) {
            this.selectDrugs = this.selectDrugs.filter(drug => drug.id !== drugId);
            message.info('Savatdan olindi')
        },
        incrementQuantity(drugId) {
            const drug = this.selectDrugs.find(drug => drug.id === drugId);
            if (drug) {
                drug.quantity += 1;
            }
        },
        decrementQuantity(drugId) {
            const drug = this.selectDrugs.find(drug => drug.id === drugId);
            if (drug && drug.quantity > 0) {
                drug.quantity -= 1;
            }
        },
        getQuantity(drugId) {
            const drug = this.selectDrugs.find(drug => drug.id === drugId)
            if (drug) {
                return drug.quantity
            }
        },
        clearList() {
            this.selectDrugs = [];
        },
        isSelected(id) {
            if (this.getQuantity(id) === 0) {
                this.removeDrug(id);
                return false;
            }
            return this.selectDrugs.some(drug => drug.id === id)
        }
    }
})
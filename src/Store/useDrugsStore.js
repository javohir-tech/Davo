import { message } from "ant-design-vue";
import { defineStore } from "pinia";

//userStore
import { useUsersStore } from "./useUserStore";

export const useDrugsStore = defineStore('drugs', {
    state: () => ({
        selectedDrugs: [],
        selectedCount: 0
    }),
    actions: {
        addDrug(drug) {
            const userStore = useUsersStore();
            if (userStore.isActive) {
                message.success(`${drug.name} savatga qo'shildi`);
                this.selectedDrugs.push({ ...drug, quantity: 1 });
                this.selectedCount += 1;
            } else {
                message.info('Ro\'yhatdan o\'ting')
            }
        },
        removeDrug(drugId) {
            const drug = this.selectedDrugs.find(drug => drug.id === drugId);
            if (drug) {
                const quantity = drug.quantity
                this.selectedCount -= quantity
            }
            this.selectedDrugs = this.selectedDrugs.filter(drug => drug.id !== drugId);
            message.info('Savatdan olindi')
        },
        incrementQuantity(drugId) {
            const drug = this.selectedDrugs.find(drug => drug.id === drugId);
            if (drug) {
                drug.quantity += 1;
                this.selectedCount += 1
            }
        },
        decrementQuantity(drugId) {
            const drug = this.selectedDrugs.find(drug => drug.id === drugId);
            if (drug && drug.quantity > 0) {
                drug.quantity -= 1;
                this.selectedCount -= 1
            }
        },
        getQuantity(drugId) {
            const drug = this.selectedDrugs.find(drug => drug.id === drugId)
            if (drug) {
                return drug.quantity
            }
        },
        clearList() {
            this.selectedDrugs = [];
            this.selectedCount =0
        },
        isSelected(id) {
            if (this.getQuantity(id) === 0) {
                this.removeDrug(id);
                return false;
            }
            return this.selectedDrugs.some(drug => drug.id === id)
        }
    }
})
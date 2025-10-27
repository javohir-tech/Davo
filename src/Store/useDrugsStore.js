import { defineStore } from "pinia";

export const useDrugsStore = defineStore('drugs', {
    state: () => ({
        selectDrugs: [],
    }),
    actions: {
        addDrug(drug) {
            this.selectDrugs.push(drug);
        },
        removeDrug(drugId) {
            this.selectDrugs = this.selectDrugs.filter(drug => drug.id !== drugId);
        },
        incrementQuantity(drugId) {
            const drug = this.selectDrugs.find(drug => drug.id === drugId);
            if (drug) {
                drug.quantity += 1;
            }
        },
        decrementQuantity(drugId) {
            const drug = this.selectDrugs.find(drug => drug.id === drugId);
            if (drug && drug.quantity > 1) {
                drug.quantity -= 1;
            }
        },
        clearList(){
            this.selectDrugs = [];
        }
    }
})
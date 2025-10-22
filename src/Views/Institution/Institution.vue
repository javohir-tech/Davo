<script setup>
//Vue
import { computed, ref } from "vue";
//ANTD
import { InputSearch, Table, Button, Space, } from "ant-design-vue"

const searchQuery = ref('')
const currentPage = ref(1);
const pageSize = ref(10);

//colums
const columns = [
    {
        title: 'Dori nomi',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Kategoriya',
        dataIndex: 'category',
        key: 'category',
        responsive: ['md']
    },
    {
        title: 'Narxi',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Ishlab chiqaruvchi',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        responsive: ['lg']
    },
    {
        title: 'Omborda',
        dataIndex: 'stock',
        key: 'stock',
        responsive: ['sm']
    },
    {
        title: 'Amallar',
        key: 'actions',
        align: 'center',
    }
];
// Mock dorilar ma'lumotlari
const mockMedicines = [
    { id: 1, name: 'Paracetamol', category: 'Og\'riq qoldiruvchi', price: 5000, manufacturer: 'PharmaCorp', stock: 150 },
    { id: 2, name: 'Ibuprofen', category: 'Yallig\'lanishga qarshi', price: 8000, manufacturer: 'HealthMed', stock: 200 },
    { id: 3, name: 'Amoxicillin', category: 'Antibiotik', price: 12000, manufacturer: 'MediPlus', stock: 80 },
    { id: 4, name: 'Aspirin', category: 'Og\'riq qoldiruvchi', price: 4500, manufacturer: 'PharmaCorp', stock: 300 },
    { id: 5, name: 'Omeprazol', category: 'Oshqozon dori', price: 15000, manufacturer: 'GastroMed', stock: 120 },
    { id: 6, name: 'Ciprofloxacin', category: 'Antibiotik', price: 18000, manufacturer: 'BioPharm', stock: 90 },
    { id: 7, name: 'Metformin', category: 'Qandli diabet', price: 20000, manufacturer: 'DiabetCare', stock: 110 },
    { id: 8, name: 'Atorvastatin', category: 'Yurak-qon tomir', price: 25000, manufacturer: 'CardioHealth', stock: 75 },
    { id: 9, name: 'Cetirizine', category: 'Allergiya', price: 7000, manufacturer: 'AllergyFree', stock: 180 },
    { id: 10, name: 'Lisinopril', category: 'Bosim dori', price: 16000, manufacturer: 'CardioHealth', stock: 95 },
    { id: 11, name: 'Salbutamol', category: 'Nafas yo\'llari', price: 22000, manufacturer: 'RespiroCare', stock: 60 },
    { id: 12, name: 'Dexamethasone', category: 'Gormon dori', price: 13000, manufacturer: 'HormonMed', stock: 140 },
    { id: 13, name: 'Vitamin D3', category: 'Vitamin', price: 9000, manufacturer: 'VitaHealth', stock: 250 },
    { id: 14, name: 'Losartan', category: 'Bosim dori', price: 17000, manufacturer: 'CardioHealth', stock: 85 },
    { id: 15, name: 'Azithromycin', category: 'Antibiotik', price: 19000, manufacturer: 'BioPharm', stock: 70 },
    { id: 16, name: 'Diclofenac', category: 'Yallig\'lanishga qarshi', price: 11000, manufacturer: 'PainRelief', stock: 160 },
    { id: 17, name: 'Simvastatin', category: 'Yurak-qon tomir', price: 21000, manufacturer: 'CardioHealth', stock: 100 },
    { id: 18, name: 'Ranitidine', category: 'Oshqozon dori', price: 10000, manufacturer: 'GastroMed', stock: 130 },
    { id: 19, name: 'Amlodipine', category: 'Bosim dori', price: 14000, manufacturer: 'CardioHealth', stock: 105 },
    { id: 20, name: 'Prednisolone', category: 'Gormon dori', price: 12500, manufacturer: 'HormonMed', stock: 115 },
];

const filteredMedicines = computed(() => {
    if (!searchQuery.value) {
        return mockMedicines;
    }
    return mockMedicines.filter(medicine => medicine.name.toLocaleLowerCase().includes(searchQuery.value.toLocaleLowerCase()));
})

const handleClick = (id) => {
    alert(`salom dunyo ${id}`)
}

</script>

<template>
    <InputSearch v-model:value="searchQuery" allowClear>
    </InputSearch>
    <Table :columns="columns" :data-source="filteredMedicines" :pagination="{
        current: currentPage,
        pageSize: pageSize,
        total: filteredMedicines.length,
        showSizeChanger: false,
        showTotal: (total) => `Jami : ${total} mahsulot`
    }" :loading="false" :scroll="{ x: 'max-content' }" :row-key="id"
        @change="(pagination) => currentPage = pagination.current">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
                <span @click="() => handleClick(record.id)">
                    {{ record.name }}
                </span>
            </template>
            <template v-else-if="column.key==='actions'">
                <Button>Batafsil</Button>
            </template>
        </template>
    </Table>
</template>
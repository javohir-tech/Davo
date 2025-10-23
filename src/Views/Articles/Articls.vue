<script setup>
//Antd
import { Modal, Card, Typography, Button, InputSearch, Menu, Row, Col, Pagination, Grid } from "ant-design-vue"
import { computed, ref } from "vue";

const searchQuery = ref('')
const currentPage = ref(1);
const pageSize = ref(6);
const modalVisible = ref(false)
const selectedServise = ref(null)

const doctors = [
    { id: 1, fullName: 'Jamshid Aliyev', specialty: 'Kardiolog', experience: 15, workDays: 'Dush-Juma', consultationFee: 150000, education: 'Toshkent tibbiyot akademiyasi' },
    { id: 2, fullName: 'Malika Karimova', specialty: 'Stomatolog', experience: 8, workDays: 'Dush-Shanba', consultationFee: 120000, education: 'Samarqand tibbiyot instituti' },
    { id: 3, fullName: 'Bobur Rahimov', specialty: 'Urolog', experience: 12, workDays: 'Sesh-Juma', consultationFee: 180000, education: 'Toshkent tibbiyot akademiyasi' },
    { id: 4, fullName: 'Dilnoza Ahmadova', specialty: 'Pediatr', experience: 10, workDays: 'Dush-Shanba', consultationFee: 100000, education: 'Andijon tibbiyot instituti' },
    { id: 5, fullName: 'Aziz Tursunov', specialty: 'Nevrolog', experience: 20, workDays: 'Dush-Juma', consultationFee: 200000, education: 'Toshkent tibbiyot akademiyasi' },
    { id: 6, fullName: 'Sevara Yusupova', specialty: 'Dermatolog', experience: 7, workDays: 'Chor-Shanba', consultationFee: 130000, education: 'Buxoro tibbiyot instituti' },
    { id: 7, fullName: 'Otabek Nazarov', specialty: 'Ortoped', experience: 14, workDays: 'Dush-Juma', consultationFee: 170000, education: 'Toshkent tibbiyot akademiyasi' },
    { id: 8, fullName: 'Nodira Ismailova', specialty: 'Ginekolog', experience: 11, workDays: 'Dush-Shanba', consultationFee: 160000, education: 'Samarqand tibbiyot instituti' },
    { id: 9, fullName: 'Rustam Ergashev', specialty: 'Oftalmolog', experience: 9, workDays: 'Sesh-Juma', consultationFee: 140000, education: "Farg'ona tibbiyot instituti" },
    { id: 10, fullName: 'Zilola Mahmudova', specialty: 'Endokrinolog', experience: 13, workDays: 'Dush-Shanba', consultationFee: 175000, education: 'Toshkent tibbiyot akademiyasi' },
    { id: 11, fullName: 'Jasur Abdullayev', specialty: 'Lor', experience: 16, workDays: 'Dush-Juma', consultationFee: 135000, education: 'Namangan tibbiyot instituti' },
    { id: 12, fullName: 'Feruza Hasanova', specialty: 'Terapevt', experience: 6, workDays: 'Dush-Shanba', consultationFee: 90000, education: 'Andijon tibbiyot instituti' },
    { id: 13, fullName: 'Sanjar Umarov', specialty: 'Xirurg', experience: 18, workDays: 'Dush-Juma', consultationFee: 250000, education: 'Toshkent tibbiyot akademiyasi' },
    { id: 14, fullName: 'Muhabbat Saidova', specialty: 'Allergolog', experience: 5, workDays: 'Chor-Shanba', consultationFee: 110000, education: 'Buxoro tibbiyot instituti' },
    { id: 15, fullName: 'Davron Mirzayev', specialty: 'Gastroenterolog', experience: 17, workDays: 'Sesh-Juma', consultationFee: 190000, education: 'Toshkent tibbiyot akademiyasi' },
    { id: 16, fullName: 'Gulnora Qodirova', specialty: 'Stomatolog', experience: 12, workDays: 'Dush-Shanba', consultationFee: 125000, education: 'Samarqand tibbiyot instituti' },
    { id: 17, fullName: 'Ilhom Sharipov', specialty: 'Urolog', experience: 10, workDays: 'Dush-Juma', consultationFee: 165000, education: 'Toshkent tibbiyot akademiyasi' },
    { id: 18, fullName: 'Kamola Nurmatova', specialty: 'Pediatr', experience: 8, workDays: 'Dush-Shanba', consultationFee: 95000, education: "Farg'ona tibbiyot instituti" },
    { id: 19, fullName: 'Sherzod Holmatov', specialty: 'Kardiolog', experience: 14, workDays: 'Sesh-Juma', consultationFee: 185000, education: 'Toshkent tibbiyot akademiyasi' },
    { id: 20, fullName: 'Adolat Rashidova', specialty: 'Nevrolog', experience: 11, workDays: 'Dush-Shanba', consultationFee: 170000, education: 'Samarqand tibbiyot instituti' },
];

const services = [
    { id: 1, title: 'Kardiologiya (Tashxis & Davolash)', specialty: 'Kardiolog', description: 'Yurak kasalliklarini tashxislash va davolash: EKQ, stress-test, gipotoniya, gipertenziya va boshqalar.', level: 'Advanced' },
    { id: 2, title: 'Stomatologiya', specialty: 'Stomatolog', description: 'Profilaktika, plombalash, protezlash, og\'riqsiz tish davolash va kosmetik stomatologiya xizmatlari.', level: 'Standard' },
    { id: 3, title: 'Urologiya', specialty: 'Urolog', description: 'Buyrak va siydik yo\'llari kasalliklari tashxisi va jarrohlik muolajalari.', level: 'Advanced' },
    { id: 4, title: 'Pediatriya', specialty: 'Pediatr', description: 'Bolalar sog\'lig\'i, emlashlar, rivojlanish monitoringi va shoshilinch yordam.', level: 'Standard' },
    { id: 5, title: 'Nevrologiya', specialty: 'Nevrolog', description: 'Nerv tizimi kasalliklari: bosh og\'rig\'i, uyqusizlik, asab kasalliklarini tashxislash va davolash.', level: 'Advanced' },
    { id: 6, title: 'Dermatologiya', specialty: 'Dermatolog', description: 'Terining kasalliklarini tashxislash va davolash, kosmetik protseduralar.', level: 'Standard' },
    { id: 7, title: 'Ortopediya', specialty: 'Ortoped', description: 'Suyak, bo\'g\'im va mushak kasalliklari; travma va reabilitatsiya.', level: 'Standard' },
    { id: 8, title: 'Ginekologiya', specialty: 'Ginekolog', description: 'Ayollar salomatligi: konsultatsiya, tashxis, homiladorlik monitoringi.', level: 'Advanced' },
    { id: 9, title: 'Oftalmologiya', specialty: 'Oftalmolog', description: 'Ko\'z kasalliklari tashxisi va davolash, kontakt linzalar va ko\'rish tuzatish.', level: 'Standard' },
    { id: 10, title: 'Endokrinologiya', specialty: 'Endokrinolog', description: 'Gormon tashxislari va davolash: qalqonsimon bez, diabet, va boshqalar.', level: 'Advanced' },
    { id: 11, title: 'Lor (ENT)', specialty: 'Lor', description: 'Burun, quloq, tomoq kasalliklari, audiometriya va endoskopiya.', level: 'Standard' },
    { id: 12, title: 'Terapiya', specialty: 'Terapevt', description: 'Ichki organlar kasalliklarini konservativ davolash va konsultatsiya.', level: 'Standard' },
    { id: 13, title: 'Xirurgiya', specialty: 'Xirurg', description: 'Operativ aralashuvlar va jarrohlik muolajalari.', level: 'Advanced' },
    { id: 14, title: 'Allergologiya', specialty: 'Allergolog', description: 'Allergik kasalliklarni tashxislash va immunoterapiya.', level: 'Standard' },
    { id: 15, title: 'Gastroenterologiya', specialty: 'Gastroenterolog', description: 'Ichak va oshqozon kasalliklari tashxisi, endoskopiya xizmatlari.', level: 'Advanced' },
    { id: 16, title: 'Stomatologik (Ortodontiya)', specialty: 'Stomatolog', description: 'Tish to\'g\'rilash va ortodontik xizmatlar.', level: 'Special' },
    { id: 17, title: 'Urologiya (Andrologiya)', specialty: 'Urolog', description: 'Erkak salomatligi va urologik muolajalar.', level: 'Advanced' },
    { id: 18, title: 'Pediatriya (Neonatologiya)', specialty: 'Pediatr', description: 'Yangi tug\'ilgan chaqaloqlar va neonatal parvarish.', level: 'Special' },
    { id: 19, title: 'Kardiologiya (Reabilitatsiya)', specialty: 'Kardiolog', description: 'Yurak kasalliklaridan keyingi reabilitatsiya va nazorat.', level: 'Special' },
    { id: 20, title: 'Nevrologiya (Reabilitatsiya)', specialty: 'Nevrolog', description: 'Asab tizimi kasalliklaridan keyingi reabilitatsiya va fizioterapiya.', level: 'Special' },
];

//Computends
const filteredServices = computed(() => {
    const q = searchQuery.value.trim().toLocaleLowerCase();
    if (!q) return services;
    return services.filter(s => s.title.toLocaleLowerCase().includes(q) ||
        (s.specialty && s.specialty.toLocaleLowerCase().includes(q)) ||
        s.description.toLocaleLowerCase().includes(q)
    )
})

const paginatedServices = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredServices.value.slice(start, start + pageSize.value)
})

const matchedDoctors = computed(() => {
    if (!selectedServise.value) return [];
    const spec = normalizeSpecialty(selectedServise.value.specialty);
    return doctors.filter(d => normalizeSpecialty(d) === spec)
})


//methods
function truncate(text, len = 80) {
    if (!text) return " ";
    return text.length > len ? text.slice(0, len) + "..." : text
}

function normalizeSpecialty(str) {
    if (str) return ""
    return String(str).toLocaleLowerCase().replace(/\s+/g, '')
}

function onPageChange(page) {
    currentPage.value = page;
    window.scroll({ top: 0, behavior: 'smooth' })
}

function modalOpen(servise) {
    modalVisible.value = true
    selectedServise.value = servise
}

function modalClose() {
    selectedServise.value = null;
}

function getLavelColor(lavel) {
    const colors = {
        'Advanced': 'green',
        'Standard': 'blue',
        'Special': 'purple'
    }
    return colors[lavel] || 'default'
}
</script>

<template>
    <div class="article-container">
        <div class="header">
            <InputSearch placeholder="Maqolani izlang" v-model:value="searchQuery" allow-clear @press-enter="" />
        </div>
        <div class="articles-section">
            <Row :gutter="[16, 16]">
                <Col v-for="service in paginatedServices" :key="service.id" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <Card hoverable @click="modalOpen(service)">
                    <template #title>
                        {{ service.title }}
                    </template>
                    <a-diviter />
                    <div class="servise-content">
                        <p>{{ service.specialty }}</p>
                        <p>{{ truncate(service.description, 100) }}</p>
                    </div>
                    <a-divider />
                    <div>
                        <a-tag :color="getLavelColor(service.level)">
                            {{ service.level }}
                        </a-tag>
                    </div>
                </Card>
                </Col>
            </Row>

            <Pagination v-model:current="currentPage" :page-size="pageSize" :total="filteredServices.length"
                style="margin-top: 10px;" @change="onPageChange" />

            <Modal :width="720" v-model:open="modalVisible" :title="selectedServise?.title" :footer="null"
                @cancel="modalClose" destroyOnClose>
                <div>
                    <a-descriptions bordered size="middle" :column="1">
                        <a-descriptions-item label="Ta'rif">
                            {{ selectedServise.description }}
                        </a-descriptions-item>
                        <a-descriptions-item label="Mutahasislik">
                            <a-tag color="blue">
                                {{ selectedServise.specialty }}
                            </a-tag>
                        </a-descriptions-item>
                        <a-descriptions label="daraja">
                            <a-tag :color="getLavelColor(selectedServise.level)">
                                {{ selectedServise.level }}
                            </a-tag>
                        </a-descriptions>
                    </a-descriptions>
                    <a-diviter />
                    <a-list :data-source="matchedDoctors" :grid="{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }">
                        <template #renderItem="{item}">
                            <a-card hoverable>

                            </a-card>
                        </template>
                    </a-list>
                </div>
            </Modal>
        </div>
    </div>
</template>

<style scoped>
.article-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
    min-height: 100vh;
}

.header {
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 30px;
    border-radius: 10px;
}

.articles-section {
    padding: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-radius: 10px;
    background-color: white;
    margin-top: 10px;
}
</style>
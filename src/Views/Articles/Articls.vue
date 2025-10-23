<script setup>
//Antd
import { Modal, Card, Typography, Button, InputSearch, Menu, Row, Col, Pagination } from "ant-design-vue"
import { computed, ref } from "vue";

const searchQuery = ref('')
const currentPage = ref(1);
const pageSize = ref(6);
const modalVisible = ref(false)
const selectedServise = ref(null)

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


//methods
function truncate(text, len = 80) {
    if (!text) return " ";
    return text.length > len ? text.slice(0, len) + "..." : text
}

function onPageChange(page) {
    currentPage.value = page;
    window.scroll({ top: 0, behavior: 'smooth' })
}

function modalOpen(servise) {
    modalVisible.value= true
    selectedServise.value = servise
}

function modalClose() {

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
                        <a-tag>
                            {{ service.level }}
                        </a-tag>
                    </div>
                </Card>
                </Col>
            </Row>

            <Pagination v-model:current="currentPage" :page-size="pageSize" :total="filteredServices.length"
                style="margin-top: 10px;" @change="onPageChange" />

            <Modal v-model:open="modalVisible" :title="selectedServise?.title" :footer="null" @cancel="modalClose" destroyOnClose>
                
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
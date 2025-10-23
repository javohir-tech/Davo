<script setup>
import Navbar from '@/Components/Navbar/Navbar.vue';


</script>

<template>
    <div>
        <Navbar />
        <main>
            <router-view v-slot="{ Component }">
                <KeepAlive :include="[]" :exclude="[]">
                    <component :is="Component" />
                </KeepAlive>
            </router-view>
        </main>
    </div>
</template>
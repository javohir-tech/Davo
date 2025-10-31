<script setup>
  //components
  import Footer from '@/Components/Footer/Footer.vue'
  import Navbar from '@/Components/Navbar/Navbar.vue'
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
      <a-back-top />
    </main>
    <Footer />
  </div>
</template>

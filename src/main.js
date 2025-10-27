import { createApp } from 'vue'
import App from './App.vue'
//Router
import { router } from './Routers/Router'
//ANTD
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
//Pinia
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaPluginPersistedstate)

app.use(Antd)
app.use(pinia)
app.use(router)
app.mount('#app')

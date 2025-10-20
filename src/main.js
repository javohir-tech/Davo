import { createApp } from 'vue'
import App from './App.vue'
//Router
import { router } from './Routers/Router'

const app = createApp(App)

app.use(router)
app.mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
//Router
import { router } from './Routers/Router'
//ANTD
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App)

app.use(Antd)
app.use(router)
app.mount('#app')

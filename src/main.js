import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import globalComponents from './components'

import './assets/style.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import dayjs from 'dayjs'
dayjs.locale('zh-cn')

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(globalComponents)

app.mount('#app')

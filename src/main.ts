import { createApp } from 'vue'
import '@lukso/web-components'
import App from './App.vue'
import { router } from './router'
import './style.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

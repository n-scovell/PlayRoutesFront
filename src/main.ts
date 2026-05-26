import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './assets/main.css'
import './assets/forms.css'
import './assets/freehand.css'
import './assets/icons.css'
import './assets/modal.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()

// ✅ THIS is what you are missing
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')
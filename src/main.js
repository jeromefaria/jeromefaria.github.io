import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/main.scss'

// Handle SPA redirect from 404.html
const redirect = sessionStorage.getItem('spa-redirect')
if (redirect) {
  sessionStorage.removeItem('spa-redirect')
  router.replace(redirect)
}

const app = createApp(App)

app.use(router)
app.mount('#app')

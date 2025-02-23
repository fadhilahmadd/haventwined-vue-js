import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './validation'

import './assets/main.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

axios.defaults.baseURL = 'http://127.0.0.1:8000/'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.withCredentials = true
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
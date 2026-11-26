import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js' // on importe le routeur

//createApp(App).mount('#app') + .use(router)
createApp(App).use(router).mount('#app')
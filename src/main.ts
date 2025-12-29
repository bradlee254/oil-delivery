import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index.ts'
import './style.css'
import { useAuthStore } from './stores/auth.ts'

const app = createApp(App);

app.use(createPinia());
const authStore = useAuthStore();
authStore.init()
app.use(router);


app.mount('#app');
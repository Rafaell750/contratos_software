import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importe o roteador

createApp(App)
  .use(router) // Use o roteador
  .mount('#app');
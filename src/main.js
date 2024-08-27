import { createApp } from 'vue'
import App from './App.vue'
import bootstrap from 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/dist/css/bootstrap.css'
import router from './routes.js'
import { BootstrapIconsPlugin } from "bootstrap-icons-vue";
import 'bootstrap-icons/font/bootstrap-icons.css';

// import Pagination from 'v-pagination-3';


createApp(App).use(router).use(BootstrapIconsPlugin).use(bootstrap).mount('#app')

// .use(router).use(BootstrapIconsPlugin).use(bootstrap)
// app.component('pagination', Pagination);

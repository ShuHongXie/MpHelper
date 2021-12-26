import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { ElButton } from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App).use(router).use(ElButton).mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { ElButton } from 'element-plus'
import 'element-plus/dist/index.css'
const electron = require('electron')
console.log(electron)

const app = createApp(App).use(router).use(ElButton)
for (const key in electron) {
  console.log(key)
  app.config.globalProperties[key] = electron[key]
}
app.mount('#app')

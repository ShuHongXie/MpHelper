import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { ElButton, ElImage, ElIcon } from 'element-plus'
import * as Components from './components'
import 'element-plus/dist/index.css'
import './assets/scss/index.scss'
const electron = require('electron')

const app = createApp(App).use(router).use(ElButton).use(ElImage).use(ElIcon)
// electron方法挂载
for (const key in electron) {
  console.log(key)
  app.config.globalProperties[key] = electron[key]
}
// 全局组件
for (const key in Components) {
  app.component(key, Components[key as keyof typeof Components])
}
// Dom挂载
app.mount('#app')

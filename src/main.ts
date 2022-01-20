import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import * as Components from './components'
import './assets/scss/index.scss'
const electron = require('electron')
import db from '../db/db.js'
console.log(db)

const app = createApp(App).use(router)
// element方法挂载
app.config.globalProperties.$message = ElMessage
app.config.globalProperties.$messageBox = ElMessageBox
app.config.globalProperties.$loading = ElLoading
// electron方法挂载
for (const key in electron) {
  console.log(key)
  app.config.globalProperties[key] = electron[key]
}
// lowdb全局方法挂载
app.config.globalProperties.db = db
// 全局组件
for (const key in Components) {
  app.component(key, Components[key as keyof typeof Components])
}
// Dom挂载
app.mount('#app')

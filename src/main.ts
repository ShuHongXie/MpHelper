import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {
  ElButton,
  ElImage,
  ElIcon,
  ElForm,
  ElRow,
  ElCol,
  ElInput,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import * as Components from './components'
import './assets/scss/index.scss'
const electron = require('electron')
import db from '../db/db.js'

const app = createApp(App)
  .use(router)
  .use(ElButton)
  .use(ElImage)
  .use(ElIcon)
  .use(ElForm)
  .use(ElRow)
  .use(ElCol)
  .use(ElInput)
// element方法挂载
app.config.globalProperties.$message = ElMessage
app.config.globalProperties.$messageBox = ElMessageBox
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

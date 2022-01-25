/*
 * @Author: 谢树宏
 * @Date: 2022-01-21 09:07:44
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 11:37:52
 * @FilePath: /electron-mp-ci/src/main.ts
 */
import { createApp } from 'vue'
import App from './render/App.vue'
import router from './render/router'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import * as Components from './components'
import '@/assets/scss/index.scss'
const electron = require('electron')
const electronRemote = require('@electron/remote')
import db from './main/db'
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
// electron远程
for (const key in electronRemote) {
  console.log(key)
  app.config.globalProperties[key] = electronRemote[key]
}
// lowdb全局方法挂载
app.config.globalProperties.db = db
// 全局组件
for (const key in Components) {
  app.component(key, Components[key as keyof typeof Components])
}
// Dom挂载
app.mount('#app')

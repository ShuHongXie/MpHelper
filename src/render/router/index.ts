/*
 * @Author: 谢树宏
 * @Date: 2022-01-05 14:44:21
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-27 17:25:52
 * @FilePath: /electron-mp-ci/src/render/router/index.ts
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/home/index.vue'
import Edit from '@/views/home/edit.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/edit',
    name: 'Edit',
    component: Edit
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

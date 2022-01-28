/*
 * @Author: 谢树宏
 * @Date: 2022-01-05 14:44:21
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-28 15:50:58
 * @FilePath: /electron-mp-ci/src/render/router/index.ts
 */
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: import('@/views/home/index.vue')
  },
  {
    path: '/edit',
    name: 'Edit',
    component: import('@/views/home/edit.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

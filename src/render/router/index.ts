/*
 * @Author: 谢树宏
 * @Date: 2022-01-05 14:44:21
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-28 17:49:23
 * @FilePath: /electron-mp-ci/src/render/router/index.ts
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/home/index.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/edit',
    name: 'Edit',
    component: () => import('@/views/home/edit.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

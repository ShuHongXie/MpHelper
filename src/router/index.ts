import { createRouter, createWebHistory } from 'vue-router'
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
  history: createWebHistory(),
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'

import Layout from '@/views/layout/Index.vue'
import { createRouteGuard } from './guard'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const router = createRouter({
  scrollBehavior() {
    return { top: 0 }
  },
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/template/temp'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/template',
      name: 'template',
      component: Layout,
      meta: { title: '模版' },
      children: [
        {
          path: 'temp',
          name: 'temp',
          component: () => import('@/views/template/Temp.vue'),
          meta: { title: '模版-1' }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/not-found/index.vue')
    }
  ]
})

createRouteGuard(router)

export default router
export { listenerRouteChange, removeRouteListener } from './guard'

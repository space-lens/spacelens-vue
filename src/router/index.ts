import { createRouter, createWebHistory } from 'vue-router'
import PlanningView from '../views/PlanningView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import LandingPageView from '@/views/LandingPageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/planning',
      name: 'planning',
      component: PlanningView,
    },
    {
      path: '/',
      name: 'landing-page',
      component: LandingPageView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

export default router

// Configuration de Vue Router
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

export const routes = [
  { path: '/', name: 'home', component: HomeView },
  {
    path: '/tout',
    name: 'all',
    component: () => import('../views/AllBreweriesView.vue'),
  },
  {
    path: '/brasserie/:id',
    name: 'brewery',
    component: () => import('../views/BreweryDetailView.vue'),
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  // Revient en haut de page à chaque changement de page (sauf bouton « retour »)
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

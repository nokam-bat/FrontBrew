import { createRouter, createWebHistory } from 'vue-router'
import Recherche from '../components/testAxios.vue'
import Detail from '../views/BrasserieDetailView.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: { name: 'recherche' } },
    { path: '/recherche', name: 'recherche', component: Recherche },
    { path: '/detail/:id', name: 'brasserie-detail', component: Detail, props: true },
  ],
})
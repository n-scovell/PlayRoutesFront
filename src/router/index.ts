import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    meta: { icon: 'home',  transition: 'slide-left', active: 'sideNav' },
    component: HomeView,
  },
   {
    path: '/plays',
    name: 'Plays',
    meta: { icon: 'plays',  transition: 'slide-left', active: 'sideNav' },
    component: () => import('../views/PlaysView.vue')
  },
  {
    path: '/create',
    name: 'Create Play',
    meta: { icon: 'create',  transition: 'slide-left', active: 'sideNav' },
    component: () => import('../views/MakeView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: { icon: 'login',  transition: 'slide-left', active: 'sideNav' },
    component: () => import('../views/LoginView.vue')
  }, 
  {
    path: '/profile',
    name: 'Profile',
    meta: { icon: 'login',  transition: 'slide-left', active: 'avatar' },
    component: () => import('../views/ProfileView.vue')
  }, 
    {
    path: '/formations',
    name: 'Formations',
    meta: { icon: 'login',  transition: 'slide-left', active: 'avatar' },
    component: () => import('../views/FormationsView.vue')
  }, 
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
export default router
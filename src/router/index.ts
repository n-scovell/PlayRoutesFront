import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    meta: { icon: 'home',  transition: 'slide-left', active: 'topNav' },
    component: HomeView,
  },
  {
    path: '/create',
    name: 'Create',
    meta: { icon: 'create',  transition: 'slide-left', active: 'topNav' },
    component: () => import('../views/MakeView.vue')
  },
   {
    path: '/plays',
    name: 'Playbook',
    meta: { icon: 'plays',  transition: 'slide-left', active: 'topNav' },
    component: () => import('../views/PlaysView.vue')
  },
  
  {
    path: '/register',
    name: 'Register',
    meta: { icon: 'create',  transition: 'slide-left', active: 'sideNav' },
    component: () => import('../views/RegisterView.vue')
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
  // {
  //   path: '/formations',
  //   name: 'Formations',
  //   meta: { icon: 'login',  transition: 'slide-left', active: 'topNav' },
  //   component: () => import('../views/FormationsView.vue')
  // }, 
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
export default router
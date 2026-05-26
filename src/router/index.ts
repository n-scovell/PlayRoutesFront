import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import ChalkboardIcon from '../assets/icons/ico_chalkboard.svg'
// import HomeIcon from '../assets/icons/ico_home.svg'
// import PlaysIcon from '../assets/icons/ico_plays.svg'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    meta: { icon: 'home',  transition: 'slide-left' },
    component: HomeView,
  },
   {
    path: '/plays',
    name: 'Plays',
    meta: { icon: 'plays',  transition: 'slide-left' },
    component: () => import('../views/PlaysView.vue')
  },
  {
    path: '/create',
    name: 'Create Play',
    meta: { icon: 'create',  transition: 'slide-left' },
    component: () => import('../views/MakeView.vue')
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   meta: { icon: 'about',  transition: 'slide-left' },
  //   component: () => import('../views/AboutView.vue'),
  // },
  {
    path: '/login',
    name: 'Login',
    meta: { icon: 'login',  transition: 'slide-left' },
    component: () => import('../views/LoginView.vue')
  },
  // {
  //   path: '/freehand',
  //   name: 'Freehand',
  //   meta: { icon: 'free',  transition: 'slide-left' },
  //   component: () => import('../views/Freehand.vue')
  // },
  // {
  //   path: '/test',
  //   name: 'Test',
  //   meta: { icon: 'about',  transition: 'slide-left' },
  //   component: () => import('../views/TestView.vue'),
  // },
 
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
export default router
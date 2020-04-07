import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Gomoku from '@/views/games/Gomoku'
import ConnectSix from '@/views/games/ConnectSix'


Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/gomoku',
        name: 'gomoku',
        component : Gomoku
    },
    {
        path: '/connectsix',
        name: 'connectsix',
        component: ConnectSix
    }
]

const router = new VueRouter({
  routes
})

export default router

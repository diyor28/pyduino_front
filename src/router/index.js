import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Sensors from '../views/Sensors.vue'
import Relays from '../views/Relays.vue'
import Temperatures from "../views/Temperatures";
import Calibration from "../views/Calibration";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/sensors',
        name: 'sensors',
        component: Sensors
    },
    {
        path: '/relays',
        name: 'relays',
        component: Relays
    },
    {
        path: '/temps',
        name: 'temps',
        component: Temperatures
    },
    {
        path: '/calibration',
        name: 'calibration',
        component: Calibration
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router

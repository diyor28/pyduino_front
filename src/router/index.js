import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard/Index'
import Sensors from '../views/Sensors.vue'
import Relays from '../views/Relays.vue'
import Temperatures from "../views/Temperatures";
import Calibration from "../views/Calibration";
import GreenHouses from "../views/GreenHouses";
import TemperatureTable from "../views/Dashboard/TemperatureTable";

Vue.use(VueRouter)

const routes = [
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        children: [
            {
                path: 'house/:house_id',
                name: 'dashboard.house',
                component: TemperatureTable,
                props: route => ({ house_id: route.params.house_id, fullView: route.query.fullView })
            }
        ]
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
    },
    {
        path: '/greenhouses',
        name: 'greenhouses',
        component: GreenHouses
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router

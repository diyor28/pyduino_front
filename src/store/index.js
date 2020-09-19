import Vue from 'vue'
import Vuex from 'vuex'

import service from './service'

const url = new URL(process.env.VUE_APP_WS)
url.hostname = window.location.hostname
const WS_URL = url.href
console.log(WS_URL)

function createWebSocketPlugin() {
    const ws = new WebSocket(WS_URL);
    return store => {
        ws.onmessage = (event) => {
            let data = JSON.parse(event.data);
            store.commit('addTemperature', data)
        }
    };
}

Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        temperatures: {}
    },
    getters: {
        temperatures: state => {
            return state.temperatures
        }
    },
    mutations: {
        addTemperature(state, sensors) {
            sensors.forEach(sensor => {
                if (!state.temperatures[sensor["sensor_id"]]) {
                    Vue.set(state.temperatures, sensor["sensor_id"], [sensor])
                    return
                }
                if (state.temperatures[sensor["sensor_id"]].length >= 20)
                    state.temperatures[sensor["sensor_id"]].shift()
                state.temperatures[sensor["sensor_id"]].push(sensor)
            })
        }
    },
    actions: {},
    modules: {
        sensors: service('sensors'),
        relays: service('relays')
    },
    plugins: [createWebSocketPlugin()]
})

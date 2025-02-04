import Vue from 'vue'
import Vuex from 'vuex'

import service from './service'

const url = new URL(process.env.VUE_APP_WS)
url.hostname = window.location.hostname
const WS_URL = url.href

function createWebSocketPlugin() {
    const ws = new WebSocket(WS_URL);
    ws.onerror = e => {
        console.log(e)
    }
    return store => {
        ws.onmessage = (event) => {
            let data = JSON.parse(event.data);
            store.commit('addTemperature', data.data)
            store.commit('setError', data.err)
        }
    };
}

Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        temperatures: {},
        socketErr: ''
    },
    getters: {
        temperatures: state => {
            return state.temperatures
        },

        socketErr: state => {
            return state.socketErr
        },

        getResistance: state => (pk) => {
            {
                const reading = state.temperatures[pk]
                if (!reading)
                    return 0
                return reading.resistance
            }
        }
    },
    mutations: {
        addTemperature(state, sensors) {
            sensors.forEach(sensor => {
                Vue.set(state.temperatures, sensor["sensor_id"], sensor)
            })
        },

        setError(state, err) {
            state.socketErr = err
        }
    },
    actions: {},
    modules: {
        sensors: service('sensors'),
        relays: service('relays'),
        history: service('temperatures'),
        exports: service('exports'),
        calibration: service('calibration'),
        houses: service('houses')
    },
    plugins: [createWebSocketPlugin()]
})

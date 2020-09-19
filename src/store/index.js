import Vue from 'vue'
import Vuex from 'vuex'

import service from './service'

function createWebSocketPlugin() {
    const ws = new WebSocket(process.env.VUE_APP_WS);
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
        addTemperature(state, item) {
            Object.entries(item).forEach(([key, value]) => {
                if (!state.temperatures[key]) {
                    Vue.set(state.temperatures, key, [value])
                    return
                }
                if (state.temperatures[key].length >= 20)
                    state.temperatures[key].shift()
                state.temperatures[key].push(value)
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

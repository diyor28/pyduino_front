const axios = require('axios')

const BASE_URL = process.env.VUE_APP_BASE_API

export default function (path) {
    return {
        namespaced: true,
        state: {
            data: [],
            isLoading: false,
            count: 0
        },
        getters: {
            get: (state) => (id) => {
                return state.data.filter(el => el.id === id)[0]
            },

            find: (state) => (query) => {
                if (!query) return state.data
                let data = state.data;
                for (const [key, value] of Object.entries(query)) {
                    data = data.filter(el => el[key] === value)
                }
                return data
            }
        },
        mutations: {
            setData(state, data) {
                state.data = data
            },

            addItem(state, item) {
                state.data.push(item)
            },

            updateItem(state, item) {
                const idx = state.data.findIndex(el => el.id === item.id)
                state.data[idx] = item
            },

            removeItem(state, item) {
                const idx = state.data.findIndex(el => el.id === item.id)
                state.data.splice(idx, 1)
            }
        },
        actions: {
            get(context, id) {
                const url = BASE_URL + `/${ path }/${ id }`
                return axios.get(url).then(response => {
                    return response.data
                })
            },

            find(context, query) {
                const url = BASE_URL + `/${ path }`
                return axios.get(url).then(response => {
                    context.commit('setData', response.data)
                    return response.data
                })
            },

            create(context, data) {
                const url = BASE_URL + `/${ path }`
                return axios.post(url, data).then(response => {
                    context.commit('addItem', response.data)
                    return response.data
                }).catch(e => {
                    console.log(e.response)
                    return e
                })
            },

            patch(context, [id, data]) {
                const url = BASE_URL + `/${ path }/${ id }`
                return axios.patch(url, data).then(response => {
                    context.commit('updateItem', response.data)
                    return response.data
                })
            },

            remove(context, id) {
                const url = BASE_URL + `/${ path }/${ id }`
                return axios.delete(url).then(response => {
                    context.commit('removeItem', response.data)
                    return response.data
                })
            }
        }
    }
}

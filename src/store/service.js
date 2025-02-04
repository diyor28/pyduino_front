import Vue from 'vue'

const axios = require('axios')

const url = new URL(process.env.VUE_APP_BASE_API)
url.hostname = window.location.hostname
const BASE_URL = url.href

function storeSort(data, query) {
    data.sort((a, b) => {
        for (const [field, ascending] of Object.entries(query.$sort)) {
            if (a[field] > b[field])
                return ascending === 1 ? 1 : -1
            else
                return ascending === 1 ? -1 : 1
        }
    })
    return data
}

function storeSearch(data, query) {
    for (const [key, operation] of Object.entries(query)) {
        data = data.filter(el => {
            if (typeof operation === 'object') {
                if (operation.$regex) {
                    if (!el[key])
                        return false
                    return el[key].match(new RegExp(operation.$regex, 'i'))
                }
                if (operation.$in)
                    return operation.$in.includes(el[key])
                if (operation.$ne)
                    return el[key] !== operation.$ne
                return true
            }
            return el[key] === operation
        })
    }
    if (query.$sort)
        return storeSort(data, query)
    return data
}

export default function (path) {
    return {
        namespaced: true,
        state: {
            data: [],
            isGetPending: false,
            isFindPending: false,
            isCreatePending: false,
            isPatchPending: false,
            isRemovePending: false,
            count: 0
        },
        getters: {
            get: (state) => (id) => {
                return state.data.find(el => el.id === parseInt(id))
            },

            find: (state) => (query) => {
                if (!query) return state.data
                return storeSearch(state.data, query)
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
                if (idx === -1)
                    return
                Vue.set(state.data, idx, item)
            },

            removeItem(state, item) {
                const idx = state.data.findIndex(el => el.id === item.id)
                state.data.splice(idx, 1)
            }
        },
        actions: {
            get(context, id) {
                const url = BASE_URL + `/${ path }/${ id }`
                context.state.isGetPending = true;
                return axios.get(url).then(response => {
                    return response.data
                }).finally(() => {
                    context.state.isGetPending = false;
                })
            },

            find(context, query) {
                const url = BASE_URL + path
                query = query || {}
                context.state.isFindPending = true
                return axios.get(url, {
                    params: query, paramsSerializer: (params => {
                        return Object.entries(params).map(([key, value]) => {
                            if (Array.isArray(value))
                                return value.map(el => `${ key }=${ el }`).join('&')
                            return `${ key }=${ value }`
                        }).join('&')
                    })
                }).then(response => {
                    if (query.skip || query.limit) {
                        context.commit('setData', response.data.data)
                        return response.data
                    }
                    context.commit('setData', response.data)
                    return response.data
                }).catch(e => {
                    return e
                }).finally(() => {
                    context.state.isFindPending = false
                })
            },

            create(context, data) {
                const url = BASE_URL + path
                Object.entries(([key, value]) => {
                    if (value === undefined)
                        delete data[key]
                })
                context.state.isCreatePending = true
                return axios.post(url, data).then(response => {
                    context.commit('addItem', response.data)
                    return response.data
                }).finally(() => {
                    context.state.isCreatePending = false
                })
            },

            patch(context, [id, data]) {
                Object.entries(([key, value]) => {
                    if (value === undefined)
                        delete data[key]
                })
                context.state.isPatchPending = true
                const url = BASE_URL + `${ path }/${ id }`
                return axios.patch(url, data).then(response => {
                    context.commit('updateItem', response.data)
                    return response.data
                }).finally(() => {
                    context.state.isPatchPending = false
                })
            },

            remove(context, id) {
                const url = BASE_URL + `${ path }/${ id }`
                context.state.isRemovePending = true
                return axios.delete(url).then(response => {
                    context.commit('removeItem', response.data)
                    return response.data
                }).finally(() => {
                    context.state.isRemovePending = false
                })
            }
        }
    }
}

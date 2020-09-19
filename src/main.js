import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './toasts'
import VueMoment from 'vue-moment'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/fonts/feather/feather.css'
import '@/assets/css/theme.css'
import WebSockets from './plugins/websockets'
const moment = require('moment')


Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(WebSockets)
Vue.use(VueMoment, {moment})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

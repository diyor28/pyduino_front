import Vue from 'vue'
import Toasted from 'vue-toasted';
Vue.use(Toasted)

// register the toast with the custom message
Vue.toasted.register('error', (payload) => {
    if (!payload.message) {
        return "Oops.. Something Went Wrong.."
    }
    return payload.message;
}, {
    type: 'error',
    duration: 1500,
    position: 'top-right',
    fitToScreen: true,
    theme: 'bubble',
    singleton: true
})


Vue.toasted.register('success', (payload) => {
    if (!payload.message) {
        return "Oops.. Something Went Wrong.."
    }
    return (payload.message);
}, {
    type: 'success',
    singleton: true,
    fullWidth: false,
    theme: 'toasted-primary',
    duration: 1500,
    position: 'top-right',
});


Vue.toasted.register('info', (payload) => {
    if (!payload.message) {
        return "Oops.. Something Went Wrong.."
    }
    return (payload.message);
}, {
    fitToScreen: true,
    theme: 'outline',
    type: 'info',
    duration: 1500,
    position: 'top-right',
    singleton: true
});

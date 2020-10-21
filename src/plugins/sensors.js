export default {
    install(Vue) {
        Vue.prototype.$sensorLabel = (sensor) => {
            let prefix = '';
            if (sensor.location === 'down')
                prefix = 'ТН-'
            else if (sensor.location === 'up')
                prefix = 'ТВ-'
            return prefix ? prefix + sensor.pin : sensor.label
        }
    }
}
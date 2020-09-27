<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <div v-for="location in ['up', 'down']" :key="location">
                        <table class="table">
                            <thead>
                            <tr>
                                <th style="width: 20%"></th>
                                <th style="width: 10%" v-for="index in columns" :key="index"></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>Термо сенсоры</th>
                                <td class="text-center" v-for="reading in readings(location)" :key="reading.id">
                                    {{reading.label}}
                                </td>
                            </tr>
                            <tr>
                                <th>Температура °C</th>
                                <td class="text-center" v-for="reading in readings(location)" :key="reading.id">
                                    {{reading.temperature.toFixed(1)}}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <table class="table">
                            <thead>
                            <tr>
                                <th style="width: 20%"></th>
                                <th style="width: 10%" v-for="index in columns" :key="index"></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>Пара</th>
                                <td class="text-center" v-for="(delta, deltaIndex) in deltas()" :key="deltaIndex">
                                    {{delta.pairA.label}} - {{delta.pairB.label}}
                                </td>
                            </tr>
                            <tr>
                                <th>Порог срабатывания °C</th>
                                <td class="text-center" v-for="(delta, deltaIndex) in deltas()" :key="deltaIndex">
                                    {{delta.pairB.delta.toFixed(1)}}
                                </td>
                            </tr>
                            <tr>
                                <th>Разница °C</th>
                                <td class="text-center" v-for="(delta, deltaIndex) in deltas()" :key="deltaIndex">
                                    {{delta.diff.toFixed(1)}}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12">
            <line-chart :data="temps"></line-chart>
        </div>
    </div>
</template>

<script>
import LineChart from "./LineChart";
import { mapGetters } from "vuex";

export default {
    name: "TemperaturesChart",
    components: { LineChart },
    data() {
        return {}
    },
    methods: {
        readings(location) {
            let processed = Object.entries(this.temps).map(([sensor_id, values]) => {
                const sensor = this.getSensor(parseInt(sensor_id));
                if (!sensor)
                    return {}
                sensor.temperature = values[values.length - 1].temperature
                return sensor
            });
            if (!location) return processed
            return processed.filter(el => el.location === location).map(el => {
                el.relay = this.getRelay(el.relay_id)
                return el
            })
        },

        deltas() {
            let result = []
            let processed = this.readings()
            processed.forEach(reading => {
                const pairSensors = this.findSensors({ pair: parseInt(reading.id) })
                pairSensors.forEach(pairSensor => {
                    const pairReading = processed.find(el => parseInt(el.id) === parseInt(pairSensor.id))
                    if (!pairReading) return
                    result.push({
                        pairA: reading,
                        pairB: { ...pairSensor, ...pairReading },
                        diff: Math.abs(reading.temperature - pairReading.temperature)
                    })
                })
            })
            return result
        }
    },
    computed: {
        ...mapGetters({ temps: 'temperatures' }),
        ...mapGetters('sensors', { getSensor: 'get', findSensors: 'find' }),
        ...mapGetters('relays', { getRelay: 'get' }),

        columns() {
            return Math.max(this.readings('up').length, this.readings('down').length)
        }
    },
    mounted() {
    },
    watch: {}
}
</script>

<style scoped>

</style>
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
                                <th v-for="index in readings(location).length" :key="index"></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>Датчик</th>
                                <td class="text-center" v-for="reading in readings(location)" :key="reading.id">
                                    {{reading.label}}
                                </td>
                            </tr>
                            <tr>
                                <th>Нижний порог °C</th>
                                <td class="text-center small" v-for="reading in readings(location)" :key="reading.id">
                                    {{reading.low_threshold.toFixed(2)}}
                                </td>
                            </tr>
                            <tr>
                                <th>Температура °C</th>
                                <td class="text-center small" v-for="reading in readings(location)" :key="reading.id">
                                    {{reading.temperature.toFixed(2)}}
                                </td>
                            </tr>
                            <tr>
                                <th>Верхний порог °C</th>
                                <td class="text-center small" v-for="reading in readings(location)" :key="reading.id">
                                    {{reading.high_threshold.toFixed(2)}}
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
                                <th v-for="index in deltas().length" :key="index"></th>
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
                                <td class="text-center small" v-for="(delta, deltaIndex) in deltas()" :key="deltaIndex">
                                    {{delta.pairB.delta.toFixed(2)}}
                                </td>
                            </tr>
                            <tr>
                                <th>Разница °C</th>
                                <td class="text-center small" v-for="(delta, deltaIndex) in deltas()" :key="deltaIndex">
                                    {{delta.diff.toFixed(2)}}
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
                return {
                    id: sensor_id,
                    label: sensor.label,
                    temperature: values[0].temperature,
                    high_threshold: sensor.high_threshold,
                    low_threshold: sensor.low_threshold,
                    pair: sensor.pair,
                    location: sensor.location
                }
            });
            if (!location) return processed
            return processed.filter(el => el.location === location)
        },

        deltas() {
            let result = []
            let processed = this.readings()
            processed.forEach(reading => {
                const pairSensors = this.findSensors({ pair: parseInt(reading.id) })
                pairSensors.forEach(pairSensor => {
                    const pair = processed.find(el => parseInt(el.id) === parseInt(pairSensor.id))
                    if (!pair) return
                    result.push({
                        pairA: reading,
                        pairB: { ...pairSensor, ...pair },
                        diff: Math.abs(reading.temperature - pair.temperature)
                    })
                })
            })
            return result
        }
    },
    computed: {
        ...mapGetters({ temps: 'temperatures' }),
        ...mapGetters('sensors', { getSensor: 'get', findSensors: 'find' }),
    },
    mounted() {
    },
    watch: {}
}
</script>

<style scoped>

</style>
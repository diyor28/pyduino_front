<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <table class="table">
                        <thead>
                        <tr>
                            <td>Датчик</td>
                            <th>Нижний порог</th>
                            <th>Температура</th>
                            <th>Верхний порог</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="reading in readings('up')" :key="reading.id">
                            <td>{{reading.label}}</td>
                            <td>{{reading.low_threshold}} °C</td>
                            <td>{{reading.temperature.toFixed(2)}} °C</td>
                            <td>{{reading.high_threshold}} °C</td>
                        </tr>
                        </tbody>
                    </table>
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
            processed = processed.map(reading => {
                const pairSensors = this.findSensors({ pair: parseInt(reading.id) })
                reading.pairDifferences = []
                if (pairSensors) {
                    pairSensors.forEach(pairSensor => {
                        const pair = processed.find(el => parseInt(el.id) === parseInt(pairSensor.id))
                        if (!pair) return
                        console.log(reading.temperature, pair.temperature)
                        reading.pairDifferences.push({
                            pair,
                            diff: reading.temperature - pair.temperature
                        })
                    })
                }
                return reading
            })
            // return processed.filter(el => el.location === location)
            return processed
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
<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 mt-4">
                <div class="row mb-3">
                    <div class="col" v-if="streetReading || boiler">
                        <div v-if="streetReading">
                            <span style="font-weight: bold">{{ streetReading.label }}: </span>
                            <span>{{ streetReading.temperature }}</span>
                        </div>
                        <div v-if="boiler">
                            <span style="font-weight: bold">{{ boiler.label }}: </span>
                            <span>{{ boiler.temperature }}</span>
                        </div>
                    </div>
                    <div class="col">
                        <div v-if="socketErr" class="alert alert-danger text-center small mb-0" role="alert">
                            {{ socketErr }}
                        </div>
                    </div>
                    <div class="col-auto">
                        <button @click="fullView=!fullView" class="btn btn-white">
                            <i class="fe fe-tv"></i>
                        </button>
                    </div>
                </div>
                <table class="table">
                    <template v-for="location in ['up', 'down']">
                        <thead :key="`head${location}`">
                        <tr>
                            <th style="width: 20%" v-if="fullView">
                                Термо сенсоры
                            </th>
                            <th class="text-center" style="width: 10%" v-for="reading in readings(location)" :key="reading.id">
                                {{ $sensorLabel(reading) }}
                                <br>
                                <h5 v-if="reading.label" class="small text-lowercase">
                                    ({{ reading.label }})
                                </h5>
                            </th>
                        </tr>
                        </thead>
                        <tbody :key="location">
                        <tr style="background: rgba(170,255,162,0.71)">
                            <th v-if="fullView">Температура °C</th>
                            <td class="text-center" v-for="reading in readings(location)" :key="reading.id" :style="`background: ${tempColor(reading)}`">
                                <component :is="fullView ? 'h4' : 'h3'">
                                    {{ reading.temperature.toFixed(1) }}
                                </component>
                            </td>
                        </tr>
                        </tbody>
                    </template>
                    <thead>
                    <tr>
                        <th style="width: 20%" v-if="fullView">Пара</th>
                        <th class="text-center" style="width: 10%" v-for="(delta, deltaIndex) in deltas()" :key="deltaIndex">
                            <component :is="fullView ? 'h4' : 'h3'">
                                {{ $sensorLabel(delta.pairA) }} <br> {{ $sensorLabel(delta.pairB) }}
                            </component>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th v-if="fullView">Порог срабатывания °C</th>
                        <td class="text-center" v-for="(delta, deltaIndex) in deltas()" :key="deltaIndex">
                            <component :is="fullView ? 'h4' : 'h3'">
                                {{ delta.delta.toFixed(1) }}
                            </component>
                        </td>
                    </tr>
                    <tr>
                        <th v-if="fullView">Разница °C</th>
                        <td class="text-center" v-for="(delta, deltaIndex) in deltas()" :key="deltaIndex">
                            <component :is="fullView ? 'h4' : 'h3'">
                                {{ delta.diff.toFixed(1) }}
                            </component>
                        </td>
                    </tr>
                    <tr>
                        <th v-if="fullView">Состояние реле</th>
                        <td class="text-center" v-for="(delta, deltaIndex) in deltas()" :key="deltaIndex">
                                <span class="text-muted" v-if="delta.relay">
                                    <span v-if="delta.relayActive" style="color: rgba(0,255,27,0.71)">Вкл</span>
                                    <span v-else style="color: rgba(255,0,8,0.71)">Выкл</span>
                                    <br>{{ delta.relay.label }}
                                </span>
                            <span v-else>-</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "TemperaturesChart",
    components: {},
    data() {
        return {
            fullView: true
        }
    },
    methods: {
        readings(location) {
            if (!Array.isArray(location)) {
                if (location)
                    location = [location]
                else
                    location = []
            }
            let processed = Object.entries(this.temps).map(([sensor_id, value]) => {
                const sensor = this.getSensor(parseInt(sensor_id));
                if (!sensor)
                    return {}
                sensor.temperature = value.temperature
                return sensor
            });
            processed = processed.map(el => {
                el.relay = this.getRelay(el.relay_id)
                return el
            })
            if (!location.length)
                return processed

            return processed.filter(el => location.includes(el.location))
        },

        deltas() {
            let result = []
            let processed = this.readings(['up', 'down'])
            processed.forEach(reading => {
                const pairSensors = this.findSensors({ pair: parseInt(reading.id) })
                pairSensors.forEach(pairSensor => {
                    const pairReading = processed.find(el => parseInt(el.id) === parseInt(pairSensor.id))
                    if (!pairReading)
                        return
                    const diff = Math.abs(reading.temperature - pairReading.temperature)
                    result.push({
                        pairA: reading,
                        pairB: { ...pairSensor, ...pairReading },
                        delta: pairSensor.delta,
                        diff: diff,
                        relay: pairSensor.relay,
                        relayActive: pairSensor.delta < diff
                    })
                })
            })
            return result
        },

        tempColor(reading) {
            if (reading.high_threshold && reading.temperature > reading.high_threshold)
                return 'rgba(64,134,253,0.8)'
            if (reading.low_threshold && reading.temperature < reading.low_threshold)
                return 'rgba(255,18,18, 0.8)'
        }
    },
    computed: {
        ...mapGetters({ temps: 'temperatures', socketErr: 'socketErr' }),
        ...mapGetters('sensors', { getSensor: 'get', findSensors: 'find' }),
        ...mapGetters('relays', { getRelay: 'get' }),

        columns() {
            return Math.max(this.readings('up').length, this.readings('down').length)
        },

        streetReading() {
            return this.readings().find(el => el.location === 'street')
        },

        boiler() {
            return this.readings().find(el => el.location === 'boiler')
        }
    },
    mounted() {
    },
    watch: {}
}
</script>

<style scoped>

</style>
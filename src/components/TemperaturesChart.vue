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
                    <thead>
                    <tr>
                        <th style="width: 20%" v-if="fullView">
                            Теплица
                        </th>
                        <th class="text-center border-right border-left" style="width: 10%" v-for="house in houses" :key="house.id" :colspan="house.count">
                            {{ house.label }}
                        </th>
                    </tr>
                    </thead>
                    <template v-for="location in ['up', 'down']">
                        <thead :key="`head${location}`">
                        <tr>
                            <th style="width: 20%" v-if="fullView">
                                Термо сенсоры
                            </th>
                            <th class="text-center" style="width: 10%" v-for="reading in deltas" :key="reading.id">
                                <div v-if="reading[location]">
                                    {{ $sensorLabel(reading[location]) }}
                                    <br>
                                    <h5 v-if="reading[location].label" class="small text-lowercase">
                                        ({{ reading[location].label }})
                                    </h5>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody :key="location">
                        <tr>
                            <th v-if="fullView" style="background: rgba(170,255,162,0.71)">Температура °C</th>
                            <td class="text-center" v-for="reading in deltas" :key="reading.id" :style="`background: ${tempColor(reading[location])}`">
                                <component :is="fullView ? 'h4' : 'h3'" v-if="reading[location]">
                                    {{ reading[location].temperature.toFixed(1) }}
                                </component>
                            </td>
                        </tr>
                        </tbody>
                    </template>
                    <thead>
                    <tr>
                        <th style="width: 20%" v-if="fullView">Пара</th>
                        <th class="text-center" style="width: 10%" v-for="(delta, deltaIndex) in deltas" :key="deltaIndex">
                            <component :is="fullView ? 'h4' : 'h3'" v-if="delta.up && delta.down">
                                {{ $sensorLabel(delta.up) }} <br> {{ $sensorLabel(delta.down) }}
                            </component>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th v-if="fullView">Порог срабатывания °C</th>
                        <td class="text-center" v-for="(delta, deltaIndex) in deltas" :key="deltaIndex">
                            <component :is="fullView ? 'h4' : 'h3'" v-if="delta.delta">
                                {{ delta.delta.toFixed(1) }}
                            </component>
                        </td>
                    </tr>
                    <tr>
                        <th v-if="fullView">Разница °C</th>
                        <td class="text-center" v-for="(delta, deltaIndex) in deltas" :key="deltaIndex">
                            <component :is="fullView ? 'h4' : 'h3'" v-if="delta.delta">
                                {{ delta.diff.toFixed(1) }}
                            </component>
                        </td>
                    </tr>
                    <tr>
                        <th v-if="fullView">Состояние реле</th>
                        <td class="text-center" v-for="(delta, deltaIndex) in deltas" :key="deltaIndex">
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
        <div class="row">
            <div class="col">
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
            let processed = []
            Object.entries(this.temps).forEach(([sensor_id, value]) => {
                const sensor = this.getSensor(sensor_id);
                if (!sensor)
                    return
                sensor.temperature = value.temperature
                processed.push(sensor)
            });
            processed = processed.map(el => {
                el.relay = this.getRelay(el.relay_id)
                return el
            })
            if (!location.length)
                return processed

            return processed.filter(el => location.includes(el.location))
        },

        tempColor(reading) {
            if (!reading)
                return 'rgba(170,255,162,0.71)'
            if (reading.high_threshold && reading.temperature > reading.high_threshold)
                return 'rgba(64,134,253,0.8)'
            if (reading.low_threshold && reading.temperature < reading.low_threshold)
                return 'rgba(255,18,18, 0.8)'
            return 'rgba(170,255,162,0.71)'
        }
    },
    computed: {
        ...mapGetters({ temps: 'temperatures', socketErr: 'socketErr' }),
        ...mapGetters('sensors', { getSensor: 'get', findSensors: 'find' }),
        ...mapGetters('relays', { getRelay: 'get' }),
        ...mapGetters('houses', { getHouse: 'get' }),

        deltas() {
            let result = []
            let processed = this.readings(['up', 'down'])
            processed.forEach(reading => {
                const pairReadings = processed.filter(el => el.pair === reading.id)
                if (!pairReadings.length && reading.location === 'up')
                    result.push({
                        up: reading
                    })
                pairReadings.forEach(pairReading => {
                    const diff = Math.abs(reading.temperature - pairReading.temperature)
                    result.push({
                        up: reading,
                        down: pairReading,
                        diff: diff,
                        delta: pairReading.delta,
                        relay: pairReading.relay,
                        relayActive: pairReading.delta < diff
                    })
                })
            })
            result = result.sort((a, b) => a.up.house_id > b.up.house_id ? 1 : -1)
            return result
        },

        houses() {
            let count = {}
            this.deltas.forEach(el => {
                if (el.up.house_id) {
                    if (count[el.up.house_id])
                        count[el.up.house_id]++
                    else
                        count[el.up.house_id] = 1
                }
            })
            return Object.entries(count).map(([house_id, count]) => ({ ...this.getHouse(house_id), count }))
        },

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
    }
}
</script>

<style scoped>
.reading {
    background: rgb(249, 251, 253);
}
</style>
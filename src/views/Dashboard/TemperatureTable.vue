<template>
    <div>
        <table class="table" v-if="house">
            <thead>
            <tr>
                <th style="width: 20%" v-if="fullView">
                    Теплица
                </th>
                <th class="text-center border-right border-left" style="width: 10%" :colspan="house.count">
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
                    <th v-if="fullView" :style="`background: ${baseGreen}`">Температура °C</th>
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

</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "Table",
    props: {
        house_id: [Number, String],
        fullView: [Boolean, String]
    },
    data() {
        return {
            baseGreen: 'rgba(162,255,102,0.2)'
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

            return processed.filter(el => location.includes(el.location) && el.house_id === this.house_id)
        },

        tempColor(reading) {
            if (!reading)
                return this.baseGreen
            if (reading.high_threshold && reading.temperature > reading.high_threshold)
                return 'rgba(64,134,253,0.8)'
            if (reading.low_threshold && reading.temperature < reading.low_threshold)
                return 'rgba(255,18,18, 0.8)'
            return this.baseGreen
        }
    },
    computed: {
        ...mapGetters({ temps: 'temperatures', socketErr: 'socketErr' }),
        ...mapGetters('sensors', { getSensor: 'get', findSensors: 'find' }),
        ...mapGetters('relays', { getRelay: 'get' }),
        ...mapGetters('houses', { getHouse: 'get', findHouses: 'find' }),

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
            return result
        },


        house() {
            let house = this.getHouse(this.house_id)
            if (!house)
                return
            house.count = this.deltas.length
            return house
        },

        columns() {
            return Math.max(this.readings('up').length, this.readings('down').length)
        }
    }
}
</script>

<style scoped>

</style>
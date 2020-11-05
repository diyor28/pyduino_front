<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 my-4">
                <div class="row">
                    <div class="col"></div>
                    <div class="col-auto">
                        <div v-if="streetReading">
                            <span style="font-weight: bold">{{ streetReading.label }}: </span>
                            <span>{{ streetReading.temperature }} °C</span>
                        </div>
                        <div v-if="boiler">
                            <span style="font-weight: bold">{{ boiler.label }}: </span>
                            <span>{{ boiler.temperature }} °C</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 align-items-center">
                <ul class="nav nav-tabs nav-overflow header-tabs">
                    <li class="nav-item" v-for="house in houses" :key="house.id">
                        <router-link
                            class="nav-link"
                            exact-active-class="active"
                            :to="{name:'dashboard.house', params: {house_id: house.id}, query: {fullView}}"
                        >
                            {{ house.label }}
                        </router-link>
                    </li>
                </ul>
                <div class="row mb-3">
                    <div class="col">
                        <div v-if="socketErr" class="alert alert-danger text-center small mb-0" role="alert">
                            {{ socketErr }}
                        </div>
                    </div>
                    <div class="col-auto">
                        <button @click="fullView=!fullView" class="btn btn-white">
                            <i v-if="fullView" class="fe fe-maximize"></i>
                            <i v-else class="fe fe-minimize"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: "TemperaturesChart",
    components: {},
    props: {},
    data() {
        return {
            fullView: true
        }
    },
    mounted() {
        window.addEventListener('keydown', this.listener, true);
        this.fetchHouses({}).then(data => {
            const house = data[0]
            if (!house)
                return
            this.$router.push({
                name: 'dashboard.house',
                params: { house_id: house.id },
                query: { fullView: false }
            })
        })
    },
    destroyed() {
        window.removeEventListener('keydown', this.listener, true);
    },
    watch: {
        fullView(newVal) {
            const query = Object.assign({}, this.$route.query)
            query.fullView = newVal
            this.$router.push({ name: this.$route.name, query: query, params: this.$route.params })
        }
    },
    methods: {
        ...mapActions('houses', { fetchHouses: 'find' }),

        listener(event) {
            if (event.code === 'Space') {
                let cHIndex = this.houses.findIndex(el => el.id === this.$route.params.house_id)
                let nHIndex = cHIndex + 1
                if (nHIndex === this.houses.length)
                    nHIndex = 0
                const nxtHId = this.houses[nHIndex].id
                this.$router.push({
                    name: 'dashboard.house',
                    params: { house_id: nxtHId },
                    query: { fullView: this.fullView }
                })
            }
        },

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
            if (!location.length)
                return processed

            return processed.filter(el => location.includes(el.location) && el.house_id === this.house_id)
        }
    },
    computed: {
        ...mapGetters({ temps: 'temperatures', socketErr: 'socketErr' }),
        ...mapGetters('sensors', { getSensor: 'get', findSensors: 'find' }),
        ...mapGetters('houses', { getHouse: 'get', findHouses: 'find' }),

        houses() {
            return this.findHouses({})
        },

        streetReading() {
            return this.readings().find(el => el.location === 'street')
        },

        boiler() {
            return this.readings().find(el => el.location === 'boiler')
        }
    }
}
</script>

<style scoped>
.reading {
    background: rgb(249, 251, 253);
}
</style>
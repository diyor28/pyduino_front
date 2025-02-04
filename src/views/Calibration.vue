<template>
    <div class="container-fluid">
        <div class="header mt-md-5">
            <div class="header-body">
                <div class="row align-items-end px-4">
                    <div class="col">
                        <label>Температура для калиброки</label>
                        <b-form-input v-model="referenceTemp" placeholder="24.5" type="number" step="0.01"></b-form-input>
                    </div>
                    <div class="col-auto">
                        <button-loading :loading="isCalibrating"
                                        class="btn btn-primary"
                                        @click="calibrate">
                            Откалибровать
                        </button-loading>
                    </div>
                </div>
            </div>
        </div>
        <div class="card px-5">
            <div class="card-header">
                <div class="row">
                    <div class="col"></div>
                    <div class="col-auto">
                        <button-loading :loading="isPatchPending" class="btn btn-primary" @click="saveChanges">Сохранить</button-loading>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="row" v-if="!sensors.length">
                    <div class="col-12 text-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="sr-only">Загрузка...</span>
                        </div>
                    </div>
                </div>
                <div class="row" v-else>
                    <div class="col-2 pr-5 py-2" v-for="(sensor, index) in sensors" :key="index">
                        <label>{{ $sensorLabel(sensor) }} <span v-if="sensor.label" class="small text-muted">({{ sensor.label }})</span></label>
                        <b-input-group :prepend="`${sensor.temperature.toFixed(1)} °C`" style="width: 180px">
                            <b-form-input :value="correctionRes[sensor.id]" @change="newCorRes[sensor.id]=$event" placeholder="Калибровочное значение" type="number" step="0.01"></b-form-input>
                        </b-input-group>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import ButtonLoading from "../components/ButtonLoading";

export default {
    name: "Calibration",
    components: { ButtonLoading },
    data() {
        return {
            isPatchPending: false,
            referenceTemp: null,
            correctionRes: {},
            newCorRes: {}
        }
    },
    mounted() {
        this.fetchSensors({})
    },
    watch: {
        sensors: {
            handler(newVal) {
                newVal.forEach(el => {
                    this.correctionRes[el.id] = el.correction_resistance
                })
            },
            deep: true
        }
    },
    methods: {
        ...mapActions('sensors', { fetchSensors: 'find', patchSensor: 'patch' }),
        ...mapActions('calibration', { createCalibration: 'create' }),

        calibrate() {
            this.createCalibration({ temperature: this.referenceTemp }).then(() => {
                this.fetchSensors({})
            }).catch(e => console.log(e.response))
        },

        saveChanges() {
            const pending = []
            this.isPatchPending = true;
            Object.entries(this.newCorRes).map(([sensor_id, correction_resistance]) => {
                pending.push(this.patchSensor([sensor_id, { correction_resistance }]).catch(e => console.log(e.response)))
            })
            Promise.all(pending).then(() => {
                this.newCorRes = {}
            }).finally(() => {
                this.isPatchPending = false
            })
        }
    },
    computed: {
        ...mapGetters({ temps: 'temperatures' }),
        ...mapGetters('sensors', { findSensorsStore: 'find', getSensor: 'get' }),
        ...mapState('calibration', { isCalibrating: 'isCreatePending' }),

        sensors() {
            return Object.entries(this.temps).map(([sensor_id, value]) => {
                const sensor = this.getSensor(parseInt(sensor_id));
                if (!sensor)
                    return { temperature: 0 }
                sensor.temperature = value.temperature
                return sensor
            })
        }
    }
}
</script>

<style scoped>

</style>
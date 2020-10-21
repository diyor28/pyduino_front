<template>
    <modal :title="title" :action-buttons="true" :save-action="save" :id="id" size="xl" @shown="shown" @hidden="hidden">
        <b-form>
            <div class="row">
                <div class="col-3">
                    <label>Верхний/Нижний</label>
                    <b-form-select v-model="data.location" :options="locationOptions"></b-form-select>
                </div>
                <div class="col-3">
                    <label>Название</label>
                    <b-form-input v-model="data.label" :state="validation.label"></b-form-input>
                    <b-form-invalid-feedback :state="validation.label">
                        Данное поле обезательно
                    </b-form-invalid-feedback>
                </div>
                <div class="col-3">
                    <label>Пин</label>
                    <b-form-select v-model="data.pin" :state="validation.pin" :options="pinOptions"></b-form-select>
                    <b-form-invalid-feedback :state="validation.pin">
                        Данное поле обезательно
                    </b-form-invalid-feedback>
                </div>
                <div class="col-3">
                    <label>Тип сенсора</label>
                    <b-form-select v-model="data.sensor_type" :state="validation.sensor_type" :options="sensorOptions"></b-form-select>
                    <b-form-invalid-feedback :state="validation.sensor_type">
                        Данное поле обезательно
                    </b-form-invalid-feedback>
                </div>
            </div>
            <div class="row mt-5">
                <div class="col-4">
                    <label>Верхний предел температуры</label>
                    <b-form-input v-model="data.high_threshold" type="number" step="0.01"></b-form-input>
                </div>
                <div class="col-4">
                    <label>Нижний предел температуры</label>
                    <b-form-input v-model="data.low_threshold" type="number" step="0.01"></b-form-input>
                </div>
                <div class="col-4">
                    <label>Сопротивление провода</label>
                    <b-input-group>
                        <b-form-input v-model="data.wire_resistance" type="number" step="0.01"></b-form-input>
                        <b-input-group-append>
                            <button class="btn btn-white" @click="data.wire_resistance=wireResistance">
                                <i class="fe fe-edit-2"></i>
                            </button>
                        </b-input-group-append>
                    </b-input-group>
                </div>
                <div class="col-12" v-if="data.location === 'down'">
                    <div class="row">
                        <div class="col-4">
                            <label>Пара</label>
                            <b-input-group>
                                <b-select v-model="data.pair" :options="pairOptions"></b-select>
                                <div class="input-group-append" v-if="data.pair">
                                    <button class="btn btn-white" @click="data.pair = null">
                                        <i class="fe fe-x"></i>
                                    </button>
                                </div>
                            </b-input-group>
                        </div>
                        <div class="col-4" v-if="data.pair">
                            <label>Порог срабатывания реле при разнице в </label>
                            <b-form-input v-model="data.delta" type="number"></b-form-input>
                        </div>
                        <div class="col-4" v-if="data.pair">
                            <label>Реле</label>
                            <b-input-group>
                                <b-select v-model="data.relay_id" :options="relayOptions"></b-select>
                                <div class="input-group-append" v-if="data.relay_id">
                                    <button class="btn btn-white" @click="data.relay_id = null">
                                        <i class="fe fe-x"></i>
                                    </button>
                                </div>
                            </b-input-group>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <label>Отключить</label>
                    <custom-switch id="isDisabled" v-model="data.disabled"></custom-switch>
                </div>
            </div>
        </b-form>
    </modal>
</template>

<script>
import Modal from "@/components/Modal";
import { mapActions, mapGetters } from 'vuex';
import CustomSwitch from "./CustomSwitch";

export default {
    name: "SensorModal",
    props: {
        id: String,
        model: Object
    },
    components: { CustomSwitch, Modal },
    mounted() {
    },
    data() {
        return {
            data: {
                wire_resistance: 0
            },
            showErrors: false,
            sensorOptions: [
                { value: 100, text: 'PT100' },
                { value: 1000, text: 'PT1000' }
            ],
            locationOptions: [
                { value: 'up', text: 'Верхний' },
                { value: 'down', text: 'Нижний' },
                { value: 'street', text: 'Улица' },
                { value: 'boiler', text: 'Котельная' },
            ],
            title: '',
        }
    },
    computed: {
        ...mapGetters('sensors', { find: 'find' }),
        ...mapGetters('relays', { findRelaysInStore: 'find' }),
        ...mapGetters({ getResistance: 'getResistance' }),

        wireResistance() {
            return this.getResistance(this.data.id).toFixed(2).toString()
        },

        pairOptions() {
            if (!this.data.location)
                return [];
            return this.find({ location: 'up', disabled: false }).map(el => ({ value: el.id, text: this.$sensorLabel(el) }))
        },

        relayOptions() {
            return this.findRelaysInStore({ disabled: false }).map(el => ({ value: el.id, text: el.label }))
        },

        validation() {
            if (!this.showErrors)
                return {}
            return { label: !!this.data.label, pin: !!this.data.pin, sensor_type: !!this.data.sensor_type }
        },

        pinOptions() {
            let allPins = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                22, 23, 24, 25, 26, 27, 28, 29, 30,
                31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]
            const existingPins = this.find({}).map(sensor => sensor.pin).filter(el => el !== this.data.pin)
            return allPins.filter(el => !existingPins.includes(el))
        }
    },

    methods: {
        ...mapActions('sensors', { create: 'create', patch: 'patch' }),
        ...mapActions('relays', { fetchRelays: 'find' }),

        save() {
            let data = JSON.parse(JSON.stringify(this.data));
            let promise;
            if (data.id) {
                promise = this.patch([data.id, data]);
            } else {
                promise = this.create(data)
            }
            promise.then(() => {
                this.close();
            }).catch(e => {
                console.log(e.response)
                this.showErrors = true;
            })
        },

        close() {
            this.$root.$emit('bv::hide::modal', this.id);
            this.data = {};
        },

        hidden() {

        },

        shown() {
            this.data = { location: 'up', sensor_type: 1000, ...JSON.parse(JSON.stringify(this.model)) };
            this.fetchRelays({})
        }
    }
}
</script>

<style scoped>

</style>
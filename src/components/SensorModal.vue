<template>
    <modal :title="title" :action-buttons="true" :save-action="save" :id="id" size="lg" @shown="shown" @hidden="hidden">
        <div class="row">
            <div class="col-6">
                <label>Название</label>
                <b-form-input v-model="data.label" placeholder="Задняя дверь"></b-form-input>
            </div>
            <div class="col-6">
                <label>Пин</label>
                <b-form-select v-model="data.pin" :options="pinOptions"></b-form-select>
            </div>
            <div class="col-6">
                <label>Тип сенсора</label>
                <b-form-select v-model="data.sensor_type" :options="sensorOptions"></b-form-select>
            </div>
            <div class="col-6">
                <label>Верхний/Нижний</label>
                <b-form-select v-model="data.location" :options="locationOptions"></b-form-select>
            </div>
            <div class="col-12">
                <div class="row">
                    <div class="col-6">
                        <label>Нижний порог температуры</label>
                        <b-form-input v-model="data.low_threshold" type="number"></b-form-input>
                    </div>
                    <div class="col-6">
                        <label>Верхний порог температуры</label>
                        <b-form-input v-model="data.high_threshold" type="number"></b-form-input>
                    </div>
                </div>
            </div>
            <div class="col-12" v-if="data.location === 'down'">
                <div class="row">
                    <div class="col-6">
                        <label>Пара</label>
                        <b-input-group class="mt-3">
                            <b-select v-model="data.pair" :options="pairOptions"></b-select>
                            <div class="input-group-append" v-if="data.pair">
                                <button class="btn btn-white" @click="data.pair = null">
                                    <i class="fe fe-x"></i>
                                </button>
                            </div>
                        </b-input-group>
                    </div>
                    <div class="col-6" v-if="data.pair">
                        <label>Разница температур</label>
                        <b-form-input v-model="data.delta" type="number"></b-form-input>
                    </div>
                    <div class="col-6" v-if="data.pair">
                        <label>Реле</label>
                        <b-input-group class="mt-3">
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
            data: {},
            sensorOptions: [
                { value: 100, text: 'PT100' },
                { value: 1000, text: 'PT1000' }
            ],
            locationOptions: [
                { value: 'up', text: 'Верхний' },
                { value: 'down', text: 'Нижний' }
            ],
            pinOptions: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                22, 23, 24, 25, 26, 27, 28, 29, 30,
                31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
            title: '',
        }
    },
    computed: {
        ...mapGetters('sensors', { find: 'find' }),
        ...mapGetters('relays', { findRelaysInStore: 'find' }),

        pairOptions() {
            if (!this.data.location) return [];
            return this.find({ location: 'up', disabled: false }).map(el => ({ value: el.id, text: el.label }))
        },

        relayOptions() {
            console.log(this.findRelaysInStore({}))
            return this.findRelaysInStore({ disabled: false }).map(el => ({ value: el.id, text: el.label }))
        }
    },

    methods: {
        ...mapActions('sensors', { create: 'create', patch: 'patch' }),

        save() {
            let data = this.data;
            let promise;
            if (data.id) {
                promise = this.patch([data.id, data]);
            } else {
                promise = this.create(data)
            }
            promise.then(() => {
                this.close();
            })
        },

        close() {
            this.$root.$emit('bv::hide::modal', this.id);
            this.data = {};
        },

        hidden() {

        },

        shown() {
            this.data = this.model;
        }
    }
}
</script>

<style scoped>

</style>
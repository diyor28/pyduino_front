<template>
    <modal :title="title" :action-buttons="true" :save-action="save" :id="id" size="lg" @shown="shown" @hidden="hidden">
        <div class="row">
            <div class="col-4">
                <label>Название</label>
                <b-form-input v-model="data.label" placeholder="Реле номер 1"></b-form-input>
            </div>
            <div class="col-4">
                <label>Пин</label>
                <b-form-select :options="pinOptions" v-model="data.pin" placeholder="Пин"></b-form-select>
            </div>
            <div class="col-4">
                <label>Отключить</label>
                <custom-switch id="isDisabled" v-model="data.disabled"></custom-switch>
            </div>
            <div class="col-12">
                <label>Влключить при выходе температуры на одном из датчиков из заданного диапозона</label>
                <custom-switch id="thresholdRelay" v-model="data.fire_on_threshold"></custom-switch>
            </div>
        </div>
    </modal>
</template>

<script>
import Modal from "@/components/Modal";
import { mapActions, mapGetters } from 'vuex';
import CustomSwitch from "./CustomSwitch";

export default {
    name: "RelayModal",
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
            title: ''
        }
    },
    computed: {
        ...mapGetters('relays', { findRelaysStore: 'find' }),

        pinOptions() {
            const allPins = [8, 10, 12, 11, 13, 15, 16, 18, 22, 29, 31, 32, 33, 36, 37, 38]
            const existingPins = this.findRelaysStore({}).map(sensor => sensor.pin)
            return allPins.filter(el => !existingPins.includes(el) && el !== this.data.pin)
        }
    },
    methods: {
        ...mapActions('relays', { create: 'create', patch: 'patch' }),

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
        },

        hidden() {
            this.data = {}
        },

        shown() {
            this.data = this.model;
        }
    }
}
</script>

<style scoped>

</style>
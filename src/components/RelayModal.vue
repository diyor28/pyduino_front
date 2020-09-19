<template>
    <modal :title="title" :action-buttons="true" :save-action="save" :id="id" size="lg" @shown="shown" @hidden="hidden">
        <div class="row">
            <div class="col-6">
                <label>Название</label>
                <b-form-input v-model="data.label" placeholder="Реле номер 1"></b-form-input>
            </div>
            <div class="col-6">
                <label>Пин</label>
                <b-form-input type="number" v-model="data.pin" placeholder="Пин"></b-form-input>
            </div>
            <div class="col-6">
                <label>Пара</label>
                <b-form-select v-model="data.pair_id"></b-form-select>
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
            title: '',
        }
    },
    computed: {
        ...mapGetters('relays', { find: 'find' })
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
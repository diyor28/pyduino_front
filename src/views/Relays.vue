<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div class="row">
                    <div class="col"></div>
                    <div class="col-auto">
                        <button class="btn btn-primary" @click="openSensorModal({})">Добавить</button>
                    </div>
                </div>
                <simple-table
                    :delete-item="deleteRelay"
                    :edit="editRelay"
                    :columns="columns" :data="relays">
                </simple-table>
            </div>
        </div>
        <relay-modal id="RelayModal" :model="model"></relay-modal>
    </div>
</template>

<script>
import SimpleTable from "@/components/SimpleTable";
import { modalMixins } from '@/mixins/modal'
import { mapActions, mapGetters } from "vuex";
import RelayModal from "../components/RelayModal";

export default {
    name: "Relays",
    mixins: [modalMixins],
    components: {
        RelayModal,
        SimpleTable
    },
    data() {
        return {
            columns: [
                {
                    label: 'Название',
                    name: 'label',

                    field: (item) => {
                        return item.label
                    }
                },
                {
                    label: 'Пин',
                    name: 'pin',

                    field: item => {
                        return item.pin
                    }
                }
            ]
        }
    },
    mounted() {
        this.findRelays({});
    },
    methods: {
        ...mapActions('relays', { findRelays: 'find', removeRelay: 'remove' }),

        openSensorModal(item) {
            this.openModal({ id: 'RelayModal', model: item })
        },

        editRelay(item) {
            this.openSensorModal(item)
        },

        deleteRelay(item) {
            this.removeRelay(item.id)
        }
    },
    computed: {
        ...mapGetters('relays', { findRelaysInStore: 'find' }),

        relays() {
            return this.findRelaysInStore({})
        }
    }
}
</script>

<style scoped>

</style>
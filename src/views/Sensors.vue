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
                    :delete-item="deleteSpi"
                    :edit="editSpi"
                    :columns="columns" :data="sensors">
                </simple-table>
            </div>
        </div>
        <sensor-modal :model="model" id="sensorModal"></sensor-modal>
    </div>
</template>

<script>
import SimpleTable from "@/components/SimpleTable";
import SensorModal from "@/components/SensorModal";
import { modalMixins } from '@/mixins/modal'
import { mapActions, mapGetters } from "vuex";

export default {
    name: "Spis",
    mixins: [modalMixins],
    components: {
        SensorModal,
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
                    },
                },
                {
                    label: 'Пин',
                    name: 'pin',

                    field: item => {
                        return item.pin
                    }
                },
                {
                    label: 'Тип сенсора',
                    name: 'sensor_type',
                    field: item => {
                        return 'PT' + item.sensor_type
                    }
                }
            ]
        }
    },
    mounted() {
        this.findSpis({});
    },
    methods: {
        ...mapActions('sensors', { findSpis: 'find', removeSpi: 'remove' }),

        openSensorModal(item) {
            this.openModal({ id: 'sensorModal', model: item })
        },

        editSpi(item) {
            this.openSensorModal(item)
        },

        deleteSpi(item) {
            this.removeSpi(item.id)
        }
    },
    computed: {
        ...mapGetters('sensors', { findSpisInStore: 'find' }),

        sensors() {
            return this.findSpisInStore({})
        }
    }
}
</script>

<style scoped>

</style>
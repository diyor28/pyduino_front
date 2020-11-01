<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12">
                <div class="header mt-md-5">
                    <div class="header-body">
                        <div class="row">
                            <div class="col"></div>
                            <div class="col-auto">
                                <button class="btn btn-primary" @click="openSensorModal({})">Добавить</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <div class="row align-items-center">
                            <!-- search -->
                            <div class="col order-lg-0">
                                <!-- Search -->
                                <div class="row align-items-center">
                                    <div class="col-auto pr-0 pointer">
                                        <span class="fe fe-x text-muted" v-if="query" @click="query=null"></span>
                                        <span class="fe fe-search text-muted" v-else></span>
                                    </div>
                                    <div class="col">
                                        <input
                                            type="search"
                                            v-model="query"
                                            class="form-control form-control-flush search no-glow"
                                            placeholder="Поиск"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <simple-table
                        :delete-item="deleteSensor"
                        :edit="editSensor"
                        :on-sort="setSort"
                        :columns="columns" :data="sensors">
                    </simple-table>
                </div>
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
            query: null,
            sortBy: 'label',
            order: -1,
            columns: [
                {
                    label: 'Название',
                    name: 'label',

                    field: (item) => {
                        const suffix = item.count ? ` (${ item.count })` : ''
                        const disabled = item.disabled ? '' : `<span><i class="fe fe-check" /></span>`
                        return this.$sensorLabel(item) + disabled + suffix
                    },
                    subtitle: (item) => {
                        return item.label
                    },
                    sortable: true
                },
                {
                    label: 'Пин',
                    name: 'pin',
                    field: item => {
                        return item.pin
                    },
                    sortable: true
                },
                {
                    label: 'Тип сенсора',
                    name: 'sensor_type',
                    field: item => {
                        return 'PT' + item.sensor_type
                    },
                    sortable: true
                },
                {
                    label: 'Сопративление провода',
                    name: 'wire_resistance',
                    field: item => {
                        return item.wire_resistance
                    },
                    sortable: true
                },
                {
                    label: 'Верхний/нижний порог температуры',
                    name: 'threshold',
                    field: item => {
                        if (!item.high_threshold && !item.low_threshold)
                            return ''
                        return `${ item.high_threshold || 'NA' }/${ item.low_threshold || 'NA' }`
                    },
                    sortable: true
                }
            ]
        }
    },
    mounted() {
        this.findSensors({});
    },
    methods: {
        ...mapActions('sensors', { findSensors: 'find', removeSensor: 'remove' }),

        setSort(column, order) {
            this.sortBy = column
            this.order = order
        },

        openSensorModal(item) {
            this.openModal({ id: 'sensorModal', model: item })
        },

        editSensor(item) {
            this.openSensorModal(item)
        },

        deleteSensor(item) {
            this.removeSensor(item.id)
        }
    },
    computed: {
        ...mapGetters('sensors', { findSensorsInStore: 'find' }),

        sensors() {
            return this.findSensorsInStore({ $sort: { [this.sortBy]: this.order }, label: { $regex: this.query } })
        }
    }
}
</script>

<style scoped>

</style>
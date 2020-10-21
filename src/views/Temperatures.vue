<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div class="header">
                    <div class="header-body">
                        <div class="row">
                            <div class="col">
                            </div>
                            <div class="col-auto">
                                <button class="btn btn-primary" @click="openExportModal">
                                    Экспорт
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12" v-if="exports.length">
                        <h4>Экспорты</h4>
                    </div>
                    <div class="col mb-4">
                        <b-badge class="my-2 mx-1 p-3" variant="light" v-for="item in exports" :key="item.id">
                            <a :href="downloadLink(item)">
                                {{ item.label }}
                            </a>
                            <i style="cursor: pointer" class="fe fe-x ml-2" @click="removeExport(item)"></i>
                        </b-badge>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <div class="col">
                            <sensors-filter v-model="sensorIds"></sensors-filter>
                        </div>
                        <div class="col-auto">
                            <date-filter v-model="dates"></date-filter>
                        </div>
                    </div>
                    <simple-table
                        :loading="isLoading"
                        :columns="columns"
                        :actions="false"
                        :on-sort="setSort"
                        :data="temps">
                    </simple-table>
                </div>
                <div class="mt-3 text-center" v-if="totalRows > perPage">
                    <b-pagination :total-rows="totalRows" v-model="currentPage" :per-page="perPage"></b-pagination>
                </div>
            </div>
        </div>
        <export-modal id="ExportModal" :model="model"></export-modal>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import SimpleTable from "@/components/SimpleTable";
import DateFilter from "@/components/DateFilter";
import { modalMixins } from '@/mixins/modal.js'
import ExportModal from "@/components/ExportModal";
import SensorsFilter from "../components/SensorsFilter";

export default {
    name: "Temperatures",
    components: { SensorsFilter, ExportModal, DateFilter, SimpleTable },
    mixins: [modalMixins],
    data() {
        return {
            totalRows: 0,
            perPage: 10,
            currentPage: 1,
            column: 'recorded_at',
            order: -1,
            sensorIds: [],
            dates: {}
        }
    },
    watch: {
        dates(newVal) {
            this.fetchTemperatures()
        },
        currentPage() {
            this.fetchTemperatures()
        },

        sensorIds() {
            this.fetchTemperatures()
        }
    },

    mounted() {
        this.fetchTemperatures()
        this.fetchExports()
    },
    methods: {
        ...mapActions('history', { fetch: 'find' }),
        ...mapActions('exports', { fetchExports: 'find', remove: 'remove' }),

        setSort(column, order) {
            this.column = column;
            this.order = order
        },

        downloadLink(item) {
            const url = new URL(process.env.VUE_APP_BASE_API)
            url.hostname = window.location.hostname
            return url.href + 'download/' + item.id
        },

        fetchTemperatures() {
            let query = { limit: this.perPage, skip: this.perPage * (this.currentPage - 1) }
            if (this.dates.start)
                query.start_date = this.dates.start.toISOString()
            if (this.dates.end)
                query.end_date = this.dates.end.toISOString()
            if (this.sensorIds.length)
                query.sensor_ids = this.sensorIds

            this.fetch(query).then(response => {
                this.totalRows = response.total
                console.log(response.data)
            })
        },

        openExportModal() {
            this.openModal({
                id: 'ExportModal', model: {
                    end_date: this.dates.end,
                    start_date: this.dates.start,
                    sensor_ids: this.sensorIds
                }
            })
        },

        removeExport(item) {
            this.remove(item.id)
        }
    },
    computed: {
        ...mapGetters('history', { findInStore: 'find' }),
        ...mapGetters('sensors', { findSensorsStore: 'find' }),
        ...mapGetters('exports', { findExportsStore: 'find' }),
        ...mapState('history', { isLoading: 'isLoading' }),

        columns() {
            let result = [
                {
                    label: 'Дата',
                    name: 'recorded_at',
                    duration: true,
                    sortable: true
                }
            ]
            let query = { $sort: { pin: 1 }, disabled: false }
            if (this.sensorIds.length)
                query.id = { $in: this.sensorIds }

            this.findSensorsStore(query).forEach(sensor => {
                result.push({
                    label: this.$sensorLabel(sensor),
                    name: sensor.label,
                    field: item => {
                        return item[sensor.id]
                    }
                })
            })
            return result
        },
        temps() {
            return this.findInStore({ $sort: { [this.column]: this.order } })
        },

        exports() {
            return this.findExportsStore({})
        }
    }
}
</script>

<style scoped>

</style>
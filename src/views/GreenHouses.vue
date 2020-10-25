<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12">
                <div class="header mt-md-5">
                    <div class="header-body">
                        <div class="row">
                            <div class="col"></div>
                            <div class="col-auto">
                                <button class="btn btn-primary" @click="openGhModal({})">Добавить</button>
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
                        :delete-item="deleteGh"
                        :edit="editGh"
                        :on-sort="setSort"
                        :columns="columns" :data="houses">
                    </simple-table>
                </div>
            </div>
        </div>
        <green-house-modal id="greenHouseModal" :model="model"></green-house-modal>
    </div>
</template>

<script>
import SimpleTable from "@/components/SimpleTable";
import { modalMixins } from '@/mixins/modal'
import { mapActions, mapGetters } from "vuex";
import GreenHouseModal from "../components/GreenHouseModal";

export default {
    name: "Greenhouses",
    mixins: [modalMixins],
    components: {
        GreenHouseModal,
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
                        return item.label
                    }
                },
            ]
        }
    },
    mounted() {
        this.findHouses({});
    },
    methods: {
        ...mapActions('houses', { findHouses: 'find', removeSensor: 'remove' }),

        setSort(column, order) {
            this.sortBy = column
            this.order = order
        },

        openGhModal(item) {
            this.openModal({ id: 'greenHouseModal', model: item })
        },

        editGh(item) {
            this.openGhModal(item)
        },

        deleteGh(item) {
            this.removeSensor(item.id)
        }
    },
    computed: {
        ...mapGetters('houses', { findHousesInStore: 'find' }),

        houses() {
            return this.findHousesInStore({ label: { $regex: this.query } })
        }
    }
}
</script>

<style scoped>

</style>
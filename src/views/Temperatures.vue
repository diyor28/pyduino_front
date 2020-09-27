<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <table class="table">
                    <thead>
                    <tr>
                        <th class="text-center">Датчик</th>
                        <th class="text-center">Температура</th>
                        <th class="text-center">Дата</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-center" v-for="temp in temps" :key="temp.id">
                        <td>{{temp.sensor.label}}</td>
                        <td>{{temp.temperature.toFixed(2)}}</td>
                        <td>{{$moment(temp.recorded_at).format('llll')}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: "Temperatures",
    mounted() {
        this.fetchTemperatures({})
    },
    methods: {
        ...mapActions('history', { fetchTemperatures: 'find' })
    },
    computed: {
        ...mapGetters('history', { findInStore: 'find' }),

        temps() {
            return this.findInStore({})
        }
    }
}
</script>

<style scoped>

</style>
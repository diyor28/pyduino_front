<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <temperatures-chart></temperatures-chart>
            </div>
        </div>
    </div>
</template>

<script>
import TemperaturesChart from "@/components/TemperaturesChart";

export default {
    name: 'Home',
    components: { TemperaturesChart },
    data() {
        return {
            chartData: {},
            smooth: false
        }
    },
    mounted() {
    },
    methods: {},
    computed: {}
}
</script>

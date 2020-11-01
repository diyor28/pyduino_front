<template>
    <div>
        <treeselect
            :value="value"
            @input="$emit('input', $event)"
            multiple
            :options="sensors"
            placeholder="Датчик"
        ></treeselect>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import { mapGetters } from 'vuex'
import '@/assets/css/vue-treeselect.css';

export default {
    name: "SensorsFilter",
    components: {
        Treeselect
    },
    props: {
        value: { type: Array, default: () => ([]) }
    },
    computed: {
        ...mapGetters('sensors', { findSensorsStore: 'find' }),

        sensors() {
            return this.findSensorsStore({ $sort: { pin: -1 } }).map(el => {
                const suffix = el.label ? `(${ el.label })` : ''
                return { id: el.id, label: this.$sensorLabel(el) + suffix }
            })
        }
    }
}
</script>

<style scoped>

</style>
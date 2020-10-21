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
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

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
            return this.findSensorsStore({})
        }
    }
}
</script>

<style scoped>

</style>
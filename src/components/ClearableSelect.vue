<template>
    <b-input-group>
        <b-select :value="value" @input="emit" @change="$emit" :options="options" :disabled="disabled"></b-select>
        <div class="input-group-append" v-if="value">
            <button class="btn btn-white" @click="emit(null)">
                <i class="fe fe-x"></i>
            </button>
        </div>
    </b-input-group>
</template>

<script>
export default {
    name: "ClearableSelect",
    props: {
        value: null,
        options: { type: Array, default: () => ([]) },
        disabled: Boolean
    },
    methods: {
        emit(value) {
            this.$emit('input', value)
            this.$emit('change', value)
        }
    }
}
</script>

<style scoped>

</style>
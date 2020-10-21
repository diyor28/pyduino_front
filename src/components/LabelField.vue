<template>
    <div>
        <b-form-input :value="value"
                      :state="state"
                      @change="$emit('change', $event)"
                      @input="$emit('input', $event)"></b-form-input>
        <b-form-invalid-feedback :state="state">
            Данное поле обезательно
        </b-form-invalid-feedback>
    </div>
</template>

<script>
export default {
    name: "LabelField",
    props: { value: null, state: [Boolean, null] },
    data() {
        return {}
    },
    methods: {}
}
</script>

<style scoped>
.input-group .input-group-prepend .input-group-text {
    border-right: none;
    padding-right: 0;
}

.input-group .form-control {
    padding-left: 0;
    border-left: none;
}
</style>
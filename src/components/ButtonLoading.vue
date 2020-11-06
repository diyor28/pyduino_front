<template>
    <button v-on:click="$emit('click', $event)" :type="type" :disabled="loading">
        <slot v-if="!loading"></slot>
        <div v-if="loading" class="spinner-border spinner-grow-sm">
            <span class="sr-only">Loading...</span>
        </div>
    </button>
</template>

<script>
export default {
    props: { loading: Boolean, type: String },
    computed: {
        classObject: function () {
            return this.class;
        }
    }

}
</script>

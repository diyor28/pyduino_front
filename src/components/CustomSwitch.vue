<template>
    <div class="row">
        <div class="col-auto">
            <div class="custom-control custom-switch">
                <input
                    :checked="value"
                    v-on:change="$emit('input', $event.target.checked)"
                    type="checkbox"
                    class="custom-control-input"
                    :id="id"
                />
                <label class="custom-control-label" :for="id"></label>
            </div>
        </div>
        <div class="col ml-n2" v-if="title || subtitle">
            <label class="custom-control-label1" :for="id">{{ title }}</label>
            <small class="form-text text-muted" v-if="subtitle">{{ subtitle }}</small>
        </div>
    </div>
</template>

<script>
export default {
    props: ['value', 'title', 'subtitle', 'id'],
}
</script>

<style>
</style>

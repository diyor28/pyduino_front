<template>
  <div v-if="confirm">
    <button class="btn btn-sm" @click="confirm=false">Да</button>
    <button class="btn btn-white btn-sm" @click="ok">Нет</button>
  </div>

  <button :class="buttonClass ? buttonClass : 'btn btn-white'" @click="confirm=true" v-else>
    <slot></slot>
  </button>
</template>
<script>
export default {
  props: {
    buttonClass: String
  },
  data() {
    return {
      confirm: false,
    }
  },
  methods: {
    ok() {
      this.confirm = false;
      this.$emit('confirm', true);
    }
  }
}
</script>

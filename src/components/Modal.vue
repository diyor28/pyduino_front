<template>
  <b-modal
      :id="id"
      :ref="ref"
      title="Add an appointment"
      :hideFooter="false"
      :scrollable="scrollable"
      centered
      lazy
      :size="size"
      :no-close-on-esc="false"
      @hidden="$emit('hidden')"
      @shown="$emit('shown')"
      tabindex="0"
      :no-enforce-focus="true"
  >
    <template slot="modal-header">
      <slot name="modal-header">
        <div class="card-header fixed py-0" style="width:100%">
          <div class="row align-items-center">
            <div class="col">
              <h4 class="card-header-title">{{ title }}</h4>
            </div>
            <div class="col-auto">
              <button type="button" class="close" aria-label="Close" @click="close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
        </div>
      </slot>
    </template>

    <template slot="modal-footer">
      <slot name="modal-footer">
        <div class="card-footer" style="display:block" v-if="actionButtons">
          <div class="row">
            <div class="col-auto">
              <slot name="modal-footer-actions"></slot>
            </div>
            <div class="col">
              <button
                  type="button"
                  @click="confirmDelete()"
                  v-if="deleteAction"
                  aria-label="Delete"
                  class="btn btn-danger mr-2"
              >Удалить
              </button>
            </div>
            <div class="col-auto">
              <button
                  type="button"
                  @click="close"
                  aria-label="Close"
                  class="btn btn-white mr-2"
              >
                Отменить
              </button>
              <button
                  type="button"
                  :disabled="saveDisabled"
                  @click="delayedSave"
                  v-if="saveAction"
                  aria-label="Close"
                  class="btn btn-primary mr-2"
              >Сохранить
              </button>
              <button
                  type="button"
                  @click="okAction"
                  v-if="okAction"
                  aria-label="Close"
                  class="btn btn-primary mr-2"
              >Ок
              </button>
            </div>
          </div>
        </div>
        <div class="card-footer" v-if="closeButton">
          <button type="button" @click="close" aria-label="Close" class="btn btn-white">Закрыть</button>
        </div>
      </slot>
    </template>
    <slot></slot>
  </b-modal>
</template>

<script>

export default {
  name: 'Modal',
  props: ['okAction', 'scrollable', 'title', 'id', 'actionButtons', 'closeButton', 'prop', 'saveAction', 'size', 'deleteAction', 'model'],

  data() {
    return {
      saveDisabled: false,
      timeout: null,
      ref: 'customModal'
    }
  },

  created() {

  },
  methods: {
    close() {
      this.$root.$emit('bv::hide::modal', this.id)
    },
    hideModal() {

    },
    confirmDelete() {
      if (window.confirm('Do you confirm ?')) {
        this.deleteAction();
        this.close();
      }
    },
    delayedSave() {
      this.saveDisabled = true
      this.timeout = setTimeout(() => {
        this.saveDisabled = false
      }, 1000);
      this.saveAction();

    }
  },
  components: {}
}
</script>


<style lang="scss">
header,
footer {
  border: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
}

footer {
  display: block !important;
}

.disabled {
  color: #ccc !important;
}

.card-footer {
  display: flex;
  align-items: flex-end;
  flex-direction: row-reverse;
}

.modal-full {
  max-width: 100%;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.modal-full .modal-content {
  height: auto;
  min-height: 100%;
  border-radius: 0;
}

.modal-full .close {
  font-size: 4rem;
  font-weight: normal;
}
</style>

<template>
  <div class="table-responsive">
    <table class="table table-sm table-nowrap card-table">
      <thead>
      <tr>
        <th width="10" v-if="bulkActions">
          <div class="custom-control custom-checkbox table-checkbox">
            <input
                type="checkbox"
                class="custom-control-input"
                name="ordersSelect"
                id="ordersSelectAll"
            />
            <label class="custom-control-label" for="ordersSelectAll">&nbsp;</label>
          </div>
        </th>
        <th v-for="column in columns" :key="column.name">
          <a
              href="#"
              v-if="column.sortable"
              @click="$event.preventDefault(); order=-1*order; sort=column.name; onSort(column.name, order)"
              class="text-muted sort_remove_tosort"
          >{{ column.label }}</a>
          <span v-else class="text-muted sort_remove_tosort">{{ column.label }}</span>
          <span v-if="sort == column.name">
                <span class="fe fe-chevron-down" v-if="order > 0"></span>
                <span class="fe fe-chevron-up" v-else></span>
          </span>
        </th>
        <th v-if="actions!=false"></th>
      </tr>
      </thead>
      <tbody class="list" v-if="loading">
      <tr>
        <td :colspan="columnsCount" class="orders-order text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Загружается...</span>
          </div>
        </td>
      </tr>
      </tbody>
      <tbody class="list" v-if="data && !data.length && !loading">
      <tr>
        <td :colspan="columnsCount" class="orders-order text-center">Пока ничего</td>
      </tr>
      </tbody>
      <tbody class="list" v-if="!loading && data">
      <tr v-for="item in data" :key="item.id" :class="{disabled:item.deleted}">
        <td v-if="bulkActions">
          <div class="custom-control custom-checkbox table-checkbox">
            <input
                type="checkbox"
                class="custom-control-input"
                v-model="selected"
                id="selected-item.id"
            />
            <label class="custom-control-label" for="ordersSelectOne">&nbsp;</label>
          </div>
        </td>

        <td
            v-for="column in columns"
            :key="column.id"
            :width="column.width"
            :class="column.link || column.click ? 'pointer':''"
            @click="column.link ? $router.push(column.link(item)) : column.click ? column.click(item) : null"
            style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;"
            :title="typeof item[column.name] === 'string' && item[column.name].length > 20 ? item[column.name] : ''"
            v-b-tooltip.hover
        >
          <span v-if="column.date_format">{{ formatDate(item[column.name], column.date_format) }}</span>
          <span v-else-if="column.duration">{{ unix(item[column.name]) | moment("calendar") }}</span>
          <span v-else-if="column.field" v-html="column.field(item)"></span>
          <span v-else>{{ item[column.name] }}</span>
          <div v-if="column.subtitle" class="text-muted" v-html="column.subtitle(item)"></div>
        </td>

        <td class="text-right" v-if="actions!==false">
          <span v-if="rowButtons">
              <button
                  class="btn btn-white mr-2"
                  v-for="(button, index) in rowButtons"
                  :key="index"
                  @click="button.link ? $router.push(button.link(item)) : null"
              >{{ button.label }}</button>
          </span>
          <button class="btn btn-white" @click="edit(item)" v-if="couldBeEdited(item)">
            <span class="fe fe-edit-2"></span>
          </button>
          <button
              class="btn btn-danger ml-2"
              @click="openModal({id:'confirmationModal', model:item})"
              v-if="!hideDeleteButton"
          >
            <span class="fe fe-trash"></span>
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <confirmation-modal id="confirmationModal" :item="model" :confirmAction="deleteItem"></confirmation-modal>
  </div>
</template>

<script>
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import {modalMixins} from '@/mixins/modal.js'

export default {
  props: ['data', 'columns', 'edit', 'deleteItem', 'bulkActions', 'onSort', 'loading', 'rowButtons', 'actions', 'hideDeleteButton'],
  mixins: [modalMixins],
  components: {
    ConfirmationModal
  },
  data: function () {
    return {
      sort: 'createdAt',
      order: -1,
      selected: [],
      model: {}
    }
  },
  computed: {
    columnsCount() {
      let columnsCount = this.columns.length;
      if (this.actions !== false) columnsCount++;
      return columnsCount;
    }
  },
  methods: {
    couldBeViewed(item) {
      return true;
    },
    couldBeEdited(item) {
      if (item.blocked === true) {
        return false;
      }
      return true;

      // return (item.can_update) ? true : false;
    },
    formatDate(date, format) {
      return this.$moment.utc(date).local().format(format);
    },
    unix(date) {
      return this.$moment.utc(date).local().unix();
    }
  }
}
</script>

<style scoped>

tr:hover {
  background-color: #F9FBFD;
}

</style>


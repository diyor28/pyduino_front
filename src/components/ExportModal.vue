<template>
    <modal :title="title"
           :action-buttons="true"
           :save-action="save"
           :id="id" size="lg"
           @shown="shown"
           @hidden="hidden">
        <div class="row">
            <div class="col-12">
                <label>Название экспорта</label>
                <b-form-input v-model="data.label" placeholder="За май месяц"></b-form-input>
            </div>
        </div>
    </modal>
</template>

<script>
import Modal from "@/components/Modal";
import { mapActions, mapGetters } from 'vuex';

export default {
    name: "ExportModal",
    props: {
        id: String,
        model: Object
    },
    components: { Modal },
    mounted() {
    },
    data() {
        return {
            data: {
                start_date: null,
                end_date: null,
                sensor_ids: null,
                label: ''
            },
            title: ''
        }
    },
    computed: {},

    methods: {
        ...mapActions('exports', { fetchExports: 'find', create: 'create' }),

        save() {
            let data = JSON.parse(JSON.stringify(this.data));
            this.create(data).then(() => {
                this.close();
            }).catch(e => {
                this.showErrors = true;
            })
        },

        close() {
            this.$root.$emit('bv::hide::modal', this.id);
            this.data = {};
        },

        hidden() {

        },

        shown() {
            this.data = JSON.parse(JSON.stringify(this.model));
        }
    }
}
</script>

<style scoped>

</style>
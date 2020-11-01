<template>
    <modal :title="title" :action-buttons="true" :save-action="save" :id="id" size="md" @shown="shown" @hidden="hidden">
        <b-form>
            <div class="row">
                <div class="col-6">
                    <label>Название</label>
                    <b-form-input :state="validation.label" v-model="data.label" placeholder="Теплица 1"></b-form-input>
                </div>
                <div class="col-6">
                    <label>Количество котлов</label>
                    <b-form-input v-model="data.boilers" placeholder="9"></b-form-input>
                </div>
            </div>
        </b-form>
    </modal>
</template>

<script>
import Modal from "@/components/Modal";
import { mapActions, mapGetters } from 'vuex';

export default {
    name: "GreenHouseModal",
    props: {
        id: String,
        model: Object
    },
    components: {
        Modal
    },
    mounted() {
    },
    data() {
        return {
            data: {},
            showErrors: false,
            title: '',
        }
    },
    computed: {
        ...mapGetters('houses', { find: 'find' }),

        validation() {
            if (!this.showErrors)
                return {}
            return { label: !!this.data.label }
        }
    },

    methods: {
        ...mapActions('houses', { create: 'create', patch: 'patch' }),

        save() {
            let data = JSON.parse(JSON.stringify(this.data));
            let promise;
            if (data.id) {
                promise = this.patch([data.id, data]);
            } else {
                promise = this.create(data)
            }
            promise.then(() => {
                this.close();
            }).catch(e => {
                console.log(e.response)
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
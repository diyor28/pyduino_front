<template>
    <modal
        :okAction="ok"
        :title="title"
        :id="id"
        :actionButtons="true"
        :closeButton="false"
    >Вы действительно хотите удалить эту запись?</modal>
</template>

<script>
import Modal from "@/components/Modal.vue";

export default {
    name: 'confirmationModal',
    props: ['id', 'confirmAction', 'item', 'text'],
    components: {
        Modal,
    },
    data() {
        return {
            hideForm: true,
            title: "Вы уверены?",
        }
    },
    created() {
        this.$root.$on('bv::hide::modal', (modal) => {
            this.hideForm = false;
        })
    },

    methods: {
        ok() {
            this.confirmAction(this.item);
            this.$root.$emit('bv::hide::modal', 'confirmationModal');
        }
    },

}
</script>
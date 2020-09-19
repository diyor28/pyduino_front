// define a mixin object
export const modalMixins = {
    data() {
        return {
            model: {},
            currentModalId: null,
            multiple: false
        }
    },
    created: function () {
        // this.localValues = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
        openConfirmationModal(next) {

            this.openModal({
                id: 'ConfirmationModal'
            }, {
                model: {
                    action: next
                }
            });
        },

        openConfirmationPopover(nextFunction) {
            // let details = {
            //     next: nextFunction,
            //     _id: 'temp'
            // };

            this.$nextTick(() => {
                this.$nextTick(() => {
                    console.log('this.', this.$refs);
                });
            });



            //this.$refs.confirmationPopover.$emit('open')

        },
        openCheckoutModal(appointment) {
            let details = {
                appointment,
                _id: 'temp'
            };
            const {
                Appointment
            } = this.$FeathersVuex;
            new Appointment(details);
            this.openModal({
                id: 'CheckoutModal'
            });
        },

        invoiceModal(invoiceId, print) {
            let details = {
                invoiceId: invoiceId,
                print: print,
                _id: 'temp'
            };

            const {
                Invoice
            } = this.$FeathersVuex;
            new Invoice(details);
            this.openModal({
                id: 'InvoiceModal'
            });
        },

        modal() {

            this.$root.$emit('bv::show::modal', this.currentModalId);

            return new Promise((resolve, reject) => {
                this.$root.$on('bv::hide::modal', (closedModalId) => {
                    if (closedModalId == this.currentModalId) {
                        resolve(this.model);
                    }
                });
            });
        },

        openModal(properties) {
            this.currentModalId = properties.id;
            this.multiple = properties.multiple || false;
            this.model = properties.model || {};

            this.modal().then(result => {
                // console.log('result', result);
            });
        }


    }
}

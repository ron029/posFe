<template>
    <div>
        <v-dialog
            v-model=showDialog
            width="400"
            persistent
        >
            <v-card style="width: 400px">
                <v-card-title style="background-color: blue; color: white">Payment
                    <v-spacer></v-spacer>
                    <span
                        style="border: 1px solid white; padding: 2px 10px; border-radius: 5px;"
                        @click="show.payment = false"
                    >ESC</span>
                </v-card-title>
                <v-card-text
                    class="text-center"
                    style="padding: 30px 0; font-size: 25px; height: 100%; display: flex; justify-content: center; align-items: center;"
                >
                    <p>
                        <span>CASH RECEIVED</span>
                        <v-form
                            ref="form"
                            v-model="valid"
                            @submit.prevent="processTransaction"
                        >
                            <v-text-field
                                ref="quantity"
                                style="color: black; font-size: 40px; width: 180px; text-align: center; display: block; margin-top: 30px"
                                autofocus
                                outlined
                                :color="cashInputColor"
                                :rules="[
                                    v => !!v || 'Field is required',
                                    v => !isNaN(v) || 'Field must be a number',
                                    v => v >= data.totalAmount || 'Cash must be greater than or equal to ' + data.totalAmount,
                                    // Add more rules as needed, e.g., maximum quantity
                                    // v => v <= 10 || 'Quantity cannot exceed 10'
                                ]"
                                v-model="cash"
                            >
                                <template v-slot:prepend-inner>
                                    <v-icon :color="cashInputColor" size="35" style="margin-bottom: 15px">mdi-currency-php</v-icon>
                                </template>
                            </v-text-field>
                            <v-btn v-show="false" type="submit"></v-btn>
                        </v-form>

                    </p>
                    </v-card-text>
            </v-card>
        </v-dialog>
        <NotifDialog
            :show="show.error"
            :data="{message: 'No items to pay for.'}"
            @closeDialog="closeNotif"
        />
    </div>
</template>

<script>
import NotifDialog from '@/components/NotifDialog.vue';
export default {
    components: {
        NotifDialog,
    },
    props: ['data', 'isNewTransaction'],
    data: () => ({
        valid: false,
        cash: null,
        show: {
            payment: false,
            error: false,
        },
    }),
    computed: {
        showDialog: {
            get() {
                return this.show.payment
            },
            set() {
                this.show.payment = false
            }
        },
        cashInputColor() {
            if (this.cash == null && this.cash == undefined) {
                return 'primary'
            } else if (this.cash && this.valid) {
                return 'success'
            } else {
                return 'error'
            }
        }
    },
    methods: {
        processTransaction() {
            if (this.$refs.form.validate()) {
                console.log('PROCESS TRANSACTION')
                this.$emit('saveTransaction', {tendered: this.cash})
                this.show.payment = false
            }
        },
        handleKeyPress(event) {
            if (event.key === "F5") {
                event.preventDefault()
            }
            if (event.key === "Escape" && this.show.payment) {
                event.preventDefault()
                this.show.payment = false
            }
            if (event.key === "Enter" && this.show.error) {
                event.preventDefault()
                this.show.error = false
                this.$emit('focusToBarcode')
            }
            if (event.key === "F8") {
                event.preventDefault()
                if (this.data.transactions.length > 0 || !this.isNewTransaction) {
                    this.cash = null;
                    this.show.payment = true;
                    this.$nextTick(()=>{
                        this.$refs?.form?.reset()
                    })
                } else {
                    this.show.error = true;
                }
            }
        },
        closeNotif() {
            this.show.error = false
        }
    },
    mounted() {
        window.addEventListener("keydown", this.handleKeyPress);
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeyPress);
    },
}
</script>

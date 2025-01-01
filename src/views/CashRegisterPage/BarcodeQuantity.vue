<template>
    <div>
        <v-row>
            <v-col cols="2">
                <span>Quantity:</span>
                <v-text-field
                    readonly
                    hide-details
                    outlined
                    value="ALT + Q"
                    color="white"
                    class="quantity-color"
                    style="background-color: blue;"
                ></v-text-field>
            </v-col>
            <v-col cols="7">
                <v-form
                    ref="searchBarcode"
                    @submit.prevent="searchBarcode"
                >
                    Barcode:
                    <v-text-field
                        ref="barcode"
                        outlined
                        hide-details
                        v-model="barcode"
                        :rules="[v => !!v || 'Barcode is required']"
                        autofocus
                    ></v-text-field>
                    <v-btn v-show="false" type="submit"></v-btn>
                </v-form>
            </v-col>
            <v-col cols="3">
                Total Quantity:
                <v-text-field
                    outlined
                    readonly
                    hide-details
                    :value="this.quantity"
                    class="text-center"
                    style="font-size: 25px; text-align: center;"
                ></v-text-field>
            </v-col>
        </v-row>
        <v-dialog
            v-model=showDialog
            width="400"
        >
            <v-card style="width: 400px; height: 180px">
                <v-card-title style="background-color: blue; color: white">Enter Quantity then press "Enter"</v-card-title>
                <v-card-text style="padding: 30px 0; font-size: 25px; height: 90px; display: flex; justify-content: center;">
                    <p>
                        <v-text-field
                            ref="quantity"
                            style="font-size: 40px; width: 150px; text-align: center"
                            autofocus
                            outlined
                            :rules="[
                                v => !!v || 'Quantity is required',
                                v => !isNaN(v) || 'Quantity must be a nu',
                                v => v >= 1 || 'Quantity must be greater than or equal to 1',
                                // Add more rules as needed, e.g., maximum quantity
                                // v => v <= 10 || 'Quantity cannot exceed 10'
                                ]"
                            v-model="quantity"
                        ></v-text-field>
                    </p>
                </v-card-text>
            </v-card>
        </v-dialog>
        <NotifDialog
            :show="isBarcodeNotFound"
            :data="{message: 'Item not found!'}"
            @closeDialog="closeNotif"
        />
    </div>
</template>

<script>
import NotifDialog from '../../components/NotifDialog.vue'
import { mapActions, mapGetters } from 'vuex';
export default {
    components: {
        NotifDialog,
    },
    data: () => ({
        isDialogOpen: false,
        barcode: null,
        isBarcodeNotFound : false,
        showQuantity: false,
        quantity: 1,
    }),
    props: ['focusToBarcode'],
    computed: {
        ...mapGetters(['findBarcodeData']),
        showDialog: {
            get() {
                return this.showQuantity
            },
            set() {
                this.$nextTick(()=>{
                    if (this.$refs) {
                        if (this.$refs.barcode)
                            this.$refs.barcode.focus()
                    }
                })
                this.showQuantity = false
            }
        },
    },
    watch: {
        focusToBarcode(newVal) {
            if (newVal) {
                this.focusInBarcode()
                this.$emit('offFocusToBarcode')
            }
        },
        findBarcodeData(newVal) {
            if (newVal) {
                if (newVal.STATUS === 200) {
                    this.$emit('saveBarcodeQuantity', {itemQuantity: this.quantity, ...newVal.DATA[0]})
                    this.barcode = ''
                    this.quantity = 1
                } else if (newVal.STATUS === 404) {
                    this.isBarcodeNotFound = true
                }
            }
        }
    },
    methods: {
        ...mapActions(['findBarcode', 'getCsrfToken']),
        async searchBarcode() {
            if (!this.isBarcodeNotFound && this.$refs.searchBarcode.validate()) {
                await this.getCsrfToken()
                this.findBarcode({barcode: this.barcode, quatity: this.quantity})
            }
        },
        closeNotif() {
            this.isBarcodeNotFound = false
            this.barcode = ""
            this.focusInBarcode()
        },
        handleKeyPress(event) {
            console.log('handleKeyPress event.key: ', event.key)
            if (this.isBarcodeNotFound === true) {
                this.barcode = ''
                this.isBarcodeNotFound = false
            }
            if (this.showQuantity && event.key === "Enter") {
                event.preventDefault()
                this.showQuantity = false
                this.focusInBarcode()
                if (isNaN(this.quantity) || this.quantity < 1) {
                    this.quantity = 1
                }
            }
            if (event.altKey && event.key === "q" || event.altKey && event.key === "Q") {
                event.preventDefault(); // Prevent default browser behavior
                this.quantity = null
                this.$nextTick(()=>{
                    if (this.$refs) {
                        if (this.$refs.quantity)
                            this.$refs.quantity.reset()
                    }
                })
                this.showQuantity = true
            }
            if (!this.isDialogOpen) this.focusInBarcode()
        },
        focusInBarcode() {
            this.$nextTick(()=>{
                if (this.$refs) {
                    if (this.$refs.barcode) {
                        this.$refs.barcode.focus()
                    }
                }
            })
        }
    },
    mounted() {
        window.addEventListener("keydown", this.handleKeyPress);
        this.$eventBus.$on('isDialogOpen', (data) => {
            this.isDialogOpen = data.status
        });

    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeyPress);
    },
}
</script>

<style scoped>
::v-deep(.quantity-color) input {
    color: white;
}
</style>

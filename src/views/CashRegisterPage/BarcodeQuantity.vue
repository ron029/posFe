<template>
    <div>
        <v-row>
            <!-- <v-col cols="2">
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
            </v-col> -->
            <div style="display: block; margin-left: 12px;">
                <span style="font-size: 20px;">Step 1: Input Quantity (F12)</span>
                <v-text-field
                    outlined
                    readonly
                    hide-details
                    :value="this.quantity"
                    class="text-center"
                    style="font-size: 25px; text-align: center;"
                ></v-text-field>
            </div>
            <div style="width: 100%; margin: 5px 12px 0 12px">
                <v-form
                    ref="searchBarcode"
                    @submit.prevent="searchBarcode"
                >
                    <span style="font-size: 20px;">Step 2: Barcode (Scan or Search)</span>
                    <v-combobox
                        @change="submitForm"
                        :items="productItemsToSearch"
                        :disabled="!isNewTransaction"
                        :persistent-hint="!isNewTransaction"
                        :hint="!isNewTransaction ? 'Scan is not allowed' : ''"
                        ref="barcode"
                        outlined
                        item-text="displayName"
                        item-value="barcode"
                        :return-object="false"
                        v-model="barcode"
                        :rules="[v => !!v || 'Barcode is required']"
                        autofocus
                        clearable
                        :search-input.sync="searchInputSync"
                    >
                        <template v-slot:item="{ item }">
                            <p :style="`background-color: ${item.quantity <= item.reorder_level && item.quantity > 0 ? '#ddd' : item.quantity < 1 ? '#ffc4c4' : ''}; text-align: right; width: 100%; position: relative; padding-top: 5px;`">
                                <span style="position: absolute; left: 0; font-weight: 700;">{{ item.barcode }}</span> {{ String(item.brand).toUpperCase() }} <span style="font-weight: 800;">{{ String(item.name).toUpperCase() }}</span> {{ String(item.unit).toUpperCase() }} @ <span style="font-weight: 800;">{{ item.selling_price }}</span>
                            </p>
                        </template>
                    </v-combobox>
                    <v-btn v-show="false" type="submit"></v-btn>
                </v-form>
            </div>
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
                                v => !isNaN(v) || 'Quantity must be a number',
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
        searchInputSync: null,
        isDialogOpen: false,
        barcode: null,
        isBarcodeNotFound : false,
        showQuantity: false,
        quantity: 1,
    }),
    props: ['focusToBarcode', 'isNewTransaction', 'triggerBlurBarcode', 'onClickFunc'],
    computed: {
        ...mapGetters(['findBarcodeData', 'productData']),
        productItemsToSearch() {
            return this.productData && this.productData.DATA && this.productData.DATA.length > 0
                ? this.productData.DATA.map(item => ({brand: item.brand, unit: item.unit, name: item.name, barcode: item.barcode, selling_price: item.selling_price, displayName: `${item.barcode} ${item.category} ${item.brand} ${item.name} ${item.unit} ${item.selling_price}`, quantity: item.quantity, reorder_level: item.reorder_level}))
                : []
        },
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
                if (String(this.quantity).trim() !== null || typeof this.quantity !== 'number' && isNaN(this.quantity)) {
                    this.quantity = 1
                }
                this.showQuantity = false
            }
        },
    },
    watch: {
        onClickFunc: {
            handler(newVal) {
                const BtnShortcuts = Object.keys(newVal)
                for (let i=0; i<BtnShortcuts.length; i++) {
                    if (newVal[BtnShortcuts[i]] === true) {
                        if (BtnShortcuts[i] === 'f12') {
                            this.quantity = null
                            this.$nextTick(()=>{
                                if (this.$refs) {
                                    if (this.$refs.quantity)
                                        this.$refs.quantity.reset()
                                }
                            })
                            this.showQuantity = true
                        }
                    }
                }
            },
            immediate: true,
            deep: true
        },
        triggerBlurBarcode() {
            this.$nextTick(()=>{
                if (this.$refs && this.$refs.barcode) {
                    this.$nextTick(()=>{
                        this.$refs.barcode.blur()
                    })
                }
            })
        },
        searchInputSync(newVal) {
            this.$emit('isSearchIsEmpty', newVal === null)
        },
        isNewTransaction(newVal) {
            if (!newVal) this.$refs.barcode.reset()
        },
        focusToBarcode(newVal) {
            if (newVal) {
                this.focusInBarcode()
                this.$emit('offFocusToBarcode')
            }
        },
        findBarcodeData(newVal) {
            if (newVal) {
                if (newVal.STATUS === 200) {
                    if (newVal.DATA[0].quantity <= 0) {
                        this.$emit('showNoItemsLeft')
                    } else {
                        this.$emit('saveBarcodeQuantity', {itemQuantity: this.quantity, ...newVal.DATA[0]})
                        this.barcode = ''
                        this.quantity = 1
                    }
                    if (this.$refs && this.$refs.searchBarcode) this.$refs.searchBarcode.reset()
                } else if (newVal.STATUS === 404) {
                    this.isBarcodeNotFound = true
                } else {
                    console.error(newVal.STATE)
                }
            }
        }
    },
    methods: {
        ...mapActions(['findBarcode', 'getCsrfToken', 'products']),
        submitForm() {
            if (this.$refs && this.$refs.searchBarcode)
                this.$refs.searchBarcode.$el.querySelector('.v-btn').click()
        },
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
            if (event.key === "F12") {
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
        if (!this.productData) {
            this.products()
        }
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

<template>
    <div style="font-weight: 600;">
        <v-row no-gutters>
            <v-col lg="5" md="5" style="padding: 10px 5px 0 10px;">
                <div>
                    <!-- <v-text-field
                        value="1002000000000205"
                        outlined
                        style="font-size: 20px;"
                        readonly
                        hide-details
                    >
                        <template slot="prepend-inner">
                            <span style="font-size: 22px; color: blue">REF#</span>
                        </template>
                    </v-text-field> -->
                    <div>
                        <p class="title1 colorBlue" style="margin: 15px 0 0 0;">Product Information</p>
                        <ul style="list-style-type: none; padding-left: 0;">
                            <li>Barcode: <span class="colorBlue">{{ currentTransaction.barcode }}</span></li>
                            <li>Description: <span class="colorBlue">{{ currentTransaction.name }}</span></li>
                            <li>Selling Price: <span class="colorBlue">{{ currentTransaction.selling_price ? `${parseInt(currentTransaction.selling_price).toFixed(2)} each` : null }}</span></li>
                        </ul>
                    </div>
                    <!-- <div>
                        Transaction Discount
                        <v-row>
                            <v-col>
                                <p>Member Discount: 0.00</p>
                                <p>Pos Promo: 0.00</p>
                            </v-col>
                            <v-col>
                                <p>Adjustments: 0.00</p>
                                <p>Other Discount: 0.00</p>
                            </v-col>
                        </v-row>
                    </div> -->
                    <p>Clerk: {{ cashierName }}</p>
                    <div>
                        <div style="height: 100px; width: 100px; background-color: blue; color: white; display: flex; justify-content: center; align-items: center;">F8 Payment</div>
                    </div>
                </div>
            </v-col>
            <v-col lg="7" md="7" style="padding: 10px 10px 0 5px;">
                <div>
                    <BarcodeQuantity
                        :focusToBarcode="focus.barcode"
                        @saveBarcodeQuantity="saveBarcodeQuantity"
                        @offFocusToBarcode="focus.barcode = false"
                    />
                    <div style="border: 1px solid black; padding: 10px; margin-top: 10px; position: relative;">
                        <p class="title1" style="margin: 0; padding: 0; position: absolute; left: 10px; top: 10px;">TOTAL</p>
                        <p class="text-right" style="font-size: 80px; font-weight: 700; color: red; padding: 0; margin: 0">{{ totalAmount.toFixed(2) }}</p>
                    </div>
                    <ItemTable :transactions="transactions" />
                </div>
            </v-col>
        </v-row>
        <PaymentPage
            :data="{ totalAmount, transactions }"
            @focusToBarcode="focusToBarcode"
            @saveTransaction="saveTransaction"
        />
        <NotifDialog
            :show="show.error"
            :data="{message: 'Something went wrong'}"
            @closeDialog="closeNotif"
        />
        <ChangeDialog
            :show="show.change"
            :change="changeAmount"
            @closeDialog="closechangeAmount"
        />
        <EditCurrentItem
            :show="show.editItem"
            :currentTransaction="currentTransaction"
            @closeEditCurrentItem="closeEditCurrentItem"
        />
    </div>
</template>

<script>
import EditCurrentItem from './EditCurrentItem.vue';
import ItemTable from './ItemTable.vue';
import ChangeDialog from './ChangeDialog.vue';
import NotifDialog from '@/components/NotifDialog.vue';
import PaymentPage from './PaymentPage.vue';
import { mapActions, mapGetters } from 'vuex';
import BarcodeQuantity from './BarcodeQuantity.vue';
export default {
    components: {
        EditCurrentItem,
        ItemTable,
        ChangeDialog,
        PaymentPage,
        BarcodeQuantity,
        NotifDialog,
    },
    data: () => ({
        cashierName: null,
        changeAmount: 0,
        edit: {
            selling_price: 0,
            quantity: 0
        },
        transactions: [],
        show: {
            payment: false,
            change: false,
            error: false,
            editItem: false,
        },
        focus: {
            barcode: false
        }
    }),
    computed: {
        ...mapGetters(['findBarcodeData', 'saveSalesData']),
        currentTransaction() {
            if (this.transactions.length > 0) {
                const existingProductIndex = this.transactions.findIndex(item => item.isCurrent === true)
                return this.transactions[existingProductIndex]
            } else {
                return { id: null, description: null, selling_price: null, amount: null, qty: null, unit: null, barcode: null  }
            }
        },
        totalAmount() {
            return this.transactions.reduce((total, transaction) => {
                return total + parseFloat(transaction.selling_price) * transaction.itemQuantity;
            }, 0);
        }
    },
    watch: {
        saveSalesData(newVal) {
            if (newVal.STATUS === 201) {
                this.changeAmount = newVal.DATA.change
                this.show.change = true
            } else {
                this.show.error
            }
        }
    },
    methods: {
        ...mapActions(['saveSales', 'getCsrfToken']),
        closeEditCurrentItem(data) {
            this.show.editItem = false
            console.log('closeEditCurrentItem data: ', data)
        },
        closechangeAmount() {
            this.show.change = false
            this.transactions = []
        },
        closeNotif() {
            this.show.error = false
        },
        async saveTransaction(data) {
            await this.getCsrfToken()
            this.saveSales({items: this.transactions, totalAmount: this.totalAmount, ...data, register_cash_flow_id: Number(window.$cookies.get('cash_register_recorded_id'))})
        },
        focusToBarcode() {
            this.focus.barcode = true
        },
        saveBarcodeQuantity(data) {
            console.log('saveBarcodeQuantity data: ', data);

            // Add "currentTransaction" class to the new item and remove it from others
            this.transactions.forEach((item) => {
                item.isCurrent = false; // Remove class from others
            });

            // Find the index of the existing product in transactions
            const existingProductIndex = this.transactions.findIndex(item => item.product_id === data.product_id);

            if (existingProductIndex !== -1) {
                // If the product exists, update its quantity and selling_price
                const existingProduct = this.transactions[existingProductIndex];
                existingProduct.itemQuantity += parseInt(data.itemQuantity);
                existingProduct.selling_price = (
                    parseFloat(existingProduct.selling_price) + parseFloat(data.selling_price)
                ).toFixed(2); // Ensure the selling_price stays a string with 2 decimal places
                existingProduct.isCurrent = true
                // Remove the existing product from its current position
                // this.transactions.splice(existingProductIndex, 1);

                // Add the updated product to the beginning of the list
                // this.transactions.unshift(existingProduct);
            } else {
                // Add the new product to the beginning of the list
                data.isCurrent = true
                this.transactions.unshift(data);
            }
        },
        handleKeyPress(event) {
            if (event.key === "Enter" && this.show.change) {
                event.preventDefault()
                this.closechangeAmount()
                this.show.change = false
            }
            if (event.altKey && event.key === "e" || event.altKey && event.key === "E") {
                event.preventDefault()
                if (this.transactions.length > 0) {
                    this.$eventBus.$emit('isDialogOpen', { status: true });
                    this.show.editItem = true
                }
            }
            if (event.key === "ArrowUp") {
                event.preventDefault()
                if (this.transactions.length > 0) {
                    const existingProductIndex = this.transactions.findIndex(item => item.isCurrent === true);
                    if (existingProductIndex >= 1) {
                        this.transactions[existingProductIndex].isCurrent = false
                        this.transactions[existingProductIndex - 1].isCurrent = true
                    }
                }
            }
            if (event.key === "ArrowDown") {
                event.preventDefault()
                if (this.transactions.length > 0) {
                    const existingProductIndex = this.transactions.findIndex(item => item.isCurrent === true);
                    if (existingProductIndex < this.transactions.length - 1) {
                        this.transactions[existingProductIndex].isCurrent = false
                        this.transactions[existingProductIndex + 1].isCurrent = true
                    }
                }
            }
        },
    },
    mounted() {
        this.cashierName = window.$cookies.get('name')
        window.addEventListener("keydown", this.handleKeyPress);
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeyPress);
    },
}
</script>

<style scoped lang="css">
.title1 {
    font-size: 25px;
}
</style>

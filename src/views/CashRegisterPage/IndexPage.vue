<template>
    <div style="font-weight: 600;">
        <v-row no-gutters>
            <v-col lg="1" md="1" style="padding: 10px 5px 0 10px;">
                <BtnShortcuts />
            </v-col>
            <v-col lg="6" md="6" style="padding: 10px 5px 0 10px;">
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
                </div>
            </v-col>
            <v-col lg="5" md="5" style="padding: 10px 10px 0 5px;">
                <div>
                    <ItemTable
                        :isNewTransaction="isNewTransaction"
                        :transactions="transactions"
                        :tendered="tendered"
                        @renderLastTrans="renderLastTrans"
                        @renderNewTrans="isNewTransaction = true"
                    />
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
        <NotifDialog
            :show="show.cancel"
            :data="{message: ''}"
            @closeDialog="show.cancel=false"
        >
            <template slot="action">
                <p>Cancel this transaction?</p>
                <p>
                    <v-btn color="error" @click="show.cancel = false">cancel
                        <v-chip x-small style="border-radius: 3px; width: 43px; padding: 0 0 0 2px; margin-left: 2px;">Enter</v-chip>
                    </v-btn>
                    <v-btn color="success" @click="cancelTransaction" style="margin-left: 6px;">proceed
                        <v-chip x-small style="border-radius: 3px; width: 18px; padding: 0 0 0 2px; margin-left: 2px;">F7</v-chip>
                    </v-btn>
                </p>
            </template>
        </NotifDialog>
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
import utils from './utils'
import BtnShortcuts from './BtnShortcuts.vue';
import EditCurrentItem from './EditCurrentItem.vue';
import ItemTable from './ItemTable.vue';
import ChangeDialog from './ChangeDialog.vue';
import NotifDialog from '@/components/NotifDialog.vue';
import PaymentPage from './PaymentPage.vue';
import { mapActions, mapGetters } from 'vuex';
import BarcodeQuantity from './BarcodeQuantity.vue';
export default {
    components: {
        BtnShortcuts,
        EditCurrentItem,
        ItemTable,
        ChangeDialog,
        PaymentPage,
        BarcodeQuantity,
        NotifDialog,
    },
    data: () => ({
        isNewTransaction: true,
        cashierMode: '',
        cashierName: null,
        changeAmount: 0,
        tendered: 0,
        edit: {
            selling_price: 0,
            quantity: 0
        },
        transactions: [],
        transactionsLast: null,
        show: {
            cancel: false,
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
            if (this.transactions && this.transactions.length > 0) {
                const existingProductIndex = this.transactions.findIndex(item => item.isCurrent === true)
                if (existingProductIndex !== -1)
                    return this.transactions[existingProductIndex]
            }
            return { id: null, description: null, name: null, selling_price: null, amount: null, qty: null, unit: null, barcode: null }
        },
        totalAmount() {
            if (this.transactions && this.transactions.length > 0)
                return this.transactions.reduce((total, transaction) => {
                    return total + parseFloat(transaction.selling_price) * transaction.itemQuantity;
                }, 0);
            else
                return 0
        }
    },
    watch: {
        saveSalesData(newVal) {
            if (newVal.STATUS === 201) {
                this.changeAmount = newVal.DATA.change
                this.show.change = true
                this.transactionsLast = []
            } else {
                this.show.error
            }
        }
    },
    methods: {
        ...mapActions(['saveSales', 'getCsrfToken', 'getNextSalesId', 'retriveTransaction']),
        renderLastTrans(newVal) {
            let transactions = null
            let tendered = 0
            if (newVal && newVal.length > 0) {
                tendered = Number(newVal[0].tendered) + Number(newVal[0].total_amount)
                transactions = newVal
            } else {
                this.tendered = 0
                this.transactions = structuredClone(this.transactionsLast ? this.transactionsLast : [])
                this.transactionsLast = null
                return
            }
            if (this.transactionsLast === null)
                this.transactionsLast = structuredClone(this.transactions)
            this.tendered = tendered
            this.transactions = transactions
            this.isNewTransaction = false
        },
        cancelTransaction() {
            this.transactions = []
            this.show.cancel = false
        },
        closeEditCurrentItem(data) {
            this.show.editItem = false
            console.log('closeEditCurrentItem data: ', data)
        },
        closechangeAmount() {
            this.tendered = 0
            this.show.change = false
            this.transactions = []
            this.getNextSalesId()
        },
        closeNotif() {
            this.show.error = false
        },
        async saveTransaction(data) {
            await this.getCsrfToken()
            this.tendered = data.tendered
            const isNewTransaction = this.transactionsLast.length > 0
            const args = {totalAmount: this.totalAmount, ...data, register_cash_flow_id: Number(window.$cookies.get('cash_register_recorded_id'))}
            if (isNewTransaction) {
                this.saveSales({items: this.transactions, ...args})
            } else {
                const newArr = utils.getChanges(this.transactions, this.transactionsLast)
                this.saveSalesModified({items: newArr, ...args})
            }
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
                // If the product exists, update its quantity
                const existingProduct = this.transactions[existingProductIndex];

                if ((existingProduct.itemQuantity + parseInt(data.itemQuantity)) > existingProduct.quantity) {
                    console.error('no items left')
                } else {
                    existingProduct.itemQuantity += parseInt(data.itemQuantity);
                    existingProduct.isCurrent = true
                    // Remove the existing product from its current position
                    // this.transactions.splice(existingProductIndex, 1);

                    // Add the updated product to the beginning of the list
                    // this.transactions.unshift(existingProduct);
                }

            } else {
                // Add the new product to the ending of the list
                data.isPrinting = false
                data.isCurrent = true
                this.transactions.push(data);
            }
        },
        handleKeyPress(event) {
            if (event.key === "Enter" && this.show.change) {
                event.preventDefault()
                this.closechangeAmount()
                this.show.change = false
            }
            if (event.key === "F7") {
                event.preventDefault()
                if (this.show.cancel)
                    this.cancelTransaction()
                else if (this.transactions.length > 0)
                    this.show.cancel = true
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
                    if (existingProductIndex > -1) {
                        // Use Vue’s reactivity system by creating a new array reference
                        this.transactions = this.transactions.map((item, index) => ({
                            ...item,
                            isCurrent: index === existingProductIndex - 1
                        }));
                    } else {
                        const lastTransElement = { ...this.transactions[this.transactions.length - 1], isCurrent: true, isPrinting: false };

                        this.transactions.pop();
                        this.transactions = [...this.transactions, lastTransElement];
                    }
                }
            }
            if (event.key === "ArrowDown") {
                event.preventDefault()
                if (this.transactions.length > 0) {
                    const existingProductIndex = this.transactions.findIndex(item => item.isCurrent === true);
                    if (existingProductIndex > -1) {
                        // Use Vue’s reactivity system by creating a new array reference
                        this.transactions = this.transactions.map((item, index) => ({
                            ...item,
                            isCurrent: index === existingProductIndex + 1
                        }));
                    } else {
                        const firstElement = { ...this.transactions[0], isCurrent: true, isPrinting: false };

                        this.transactions.shift();
                        this.transactions = [firstElement, ...this.transactions];
                    }
                }
            }
        },
    },
    mounted() {
        this.getNextSalesId()
        this.cashierName = window.$cookies.get('name')
        window.addEventListener("keydown", this.handleKeyPress);
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeyPress);
    },
}
</script>

<style scoped>
.title1 {
    font-size: 25px;
}
</style>

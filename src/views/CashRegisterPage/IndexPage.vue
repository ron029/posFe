<template>
    <div style="font-weight: 600;" class="poppins-regular">
        <v-row no-gutters>
            <v-col lg="6" md="6" style="padding: 10px 5px 0 10px;">
                <div>
                    <BarcodeQuantity
                        style="padding-top: 10px;"
                        :focusToBarcode="focus.barcode"
                        :isNewTransaction="isNewTransaction"
                        :triggerBlurBarcode="triggerBlurBarcode"
                        :onClickFunc="onClickFunc"
                        @saveBarcodeQuantity="saveBarcodeQuantity"
                        @offFocusToBarcode="focus.barcode = false"
                        @isSearchIsEmpty="isSearchIsEmpty"
                        @showNoItemsLeft="showNoItemsLeft"
                    />
                    <div style="border: 1px solid black; padding: 10px; margin-top: 10px; position: relative; border-radius: 5px;">
                        <p class="title1" style="margin: 0; padding: 0; position: absolute; left: 10px; top: 10px;">Step 3: Complete Payment (F9)</p>
                        <p class="text-right" style="font-size: 80px; font-weight: 700; color: green; padding: 0; margin: 0">{{ totalAmount.toFixed(2) }}</p>
                    </div>
                    <BtnShortcuts
                        style="height: 300px; width: 100%;"
                        :onClickFunc="onClickFunc"
                    />
                </div>
            </v-col>
            <v-col lg="6" md="6" style="padding: 10px 10px 0 5px;">
                <div>
                    Step 4: Print Order Slip (F4)
                    <v-card style="padding-top: 20px; margin-top: 10px;" :elevation="20">
                        <ItemTable
                            :isNewTransaction="isNewTransaction"
                            :transactions="transactions.value"
                            :tendered="tendered"
                            :show="show"
                            :onClickFunc="onClickFunc"
                            @renderLastTrans="renderLastTrans"
                            @renderNewTrans="isNewTransaction = true"
                        />
                    </v-card>
                </div>
            </v-col>
        </v-row>
        <PaymentPage
            :data="{ totalAmount, transactions: transactions.value }"
            :isNewTransaction="isNewTransaction"
            :onClickFunc="onClickFunc"
            @focusToBarcode="focusToBarcode"
            @saveTransaction="saveTransaction"
        />
        <NotifDialog
            :show="show.error"
            :data="show.errorData"
            @closeDialog="closeNotif"
        />
        <NotifDialog
            :show="show.noItemsLeft"
            :data="{message: 'No items left'}"
            @closeDialog="show.noItemsLeft=false"
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
        <NotifDialog
            :show="show.goToSales"
            :data="{message: ''}"
            @closeDialog="show.goToSales=false"
        >
            <template slot="action">
                <p>Cancel this transaction then go to sales?</p>
                <p>
                    <v-btn color="error" @click="show.goToSales = false">cancel
                        <!-- <v-chip x-small style="border-radius: 3px; width: 43px; padding: 0 0 0 2px; margin-left: 2px;">Enter</v-chip> -->
                    </v-btn>
                    <v-btn color="success" @click="goToSales()" style="margin-left: 6px;">proceed
                        <!-- <v-chip x-small style="border-radius: 3px; width: 18px; padding: 0 0 0 2px; margin-left: 2px;">F1</v-chip> -->
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
            :isNewTransaction="isNewTransaction"
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
        onClickFunc: {
            f12: false,
            f11: false,
            f9: false,
            f4: false,
            f6: false,
            f2: false
        },
        triggerBlurBarcode: 0,
        isNewTransaction: true,
        cashierMode: '',
        cashierName: null,
        changeAmount: 0,
        tendered: 0,
        edit: {
            selling_price: 0,
            quantity: 0
        },
        transactions: {
            last: null,
            value: [],
            history: []
        },
        show: {
            cancel: false,
            payment: false,
            change: false,
            error: false,
            errorData: { message: '' },
            editItem: false,
            goToSales: false,
            noItemsLeft: false,
        },
        isSearchIsEmptyVar: true,
        focus: {
            barcode: false
        }
    }),
    computed: {
        ...mapGetters(['findBarcodeData', 'saveSalesData', 'saveSalesModifiedData']),
        currentTransaction() {
            if (this.transactions.value && this.transactions.value.length > 0) {
                const existingProductIndex = this.transactions.value.findIndex(item => item.isCurrent === true)
                if (existingProductIndex !== -1)
                    return this.transactions.value[existingProductIndex]
            }
            return { id: null, description: null, name: null, selling_price: null, amount: null, qty: null, unit: null, barcode: null }
        },
        totalAmount() {
            if (this.transactions.value && this.transactions.value.length > 0)
                return this.transactions.value.reduce((total, transaction) => {
                    return total + parseFloat(transaction.selling_price) * transaction.itemQuantity;
                }, 0);
            else
                return 0
        }
    },
    watch: {
        onClickFunc: {
            handler(newVal) {
                const BtnShortcuts = Object.keys(newVal)
                this.$nextTick(()=> {
                    for (let i=0; i<BtnShortcuts.length; i++) {
                        if (newVal[BtnShortcuts[i]] === true) {
                            if (BtnShortcuts[i] === 'f11') {
                                this.handleF11Func()
                            } else if (BtnShortcuts[i] === 'f2') {
                                if (this.$route.path !== '/pos') this.$router.push('/pos')
                            }
                            newVal[BtnShortcuts[i]] = false
                        }
                    }
                })
            },
            deep: true
        },
        saveSalesModifiedData(newVal) {
            if (newVal.STATUS === 201) {
                this.show.error = true
                this.show.errorData = { message: 'Refund save successfully' }
            } else {
                console.error(newVal.STATE)
            }
        },
        saveSalesData(newVal) {
            if (newVal.STATUS === 201) {
                this.changeAmount = newVal.DATA.change
                this.show.change = true
                this.transactions.last = []
            } else {
                this.show.errorData = { message: 'Something went wrong' }
                this.show.error
            }
        }
    },
    methods: {
        ...mapActions(['saveSales', 'getCsrfToken', 'getNextSalesId', 'retriveTransaction', 'saveSalesModified', 'companyProfiles']),
        handleF11Func() {
            if (this.transactions.value.length > 0) {
                const isItemSelected = this.transactions.value.some(item => item.isCurrent === true)
                if (isItemSelected) {
                    this.$eventBus.$emit('isDialogOpen', { status: true });
                    this.show.editItem = true
                } else {
                    this.show.error = true
                    this.show.errorData = { message: 'Please select an item to edit' }
                }
            }
        },
        showNoItemsLeft() {
            this.show.noItemsLeft = true
        },
        isSearchIsEmpty(newVal) {
            this.isSearchIsEmptyVar = newVal
        },
        renderLastTrans(newVal) {
            let t = null
            let tendered = 0
            if (newVal && newVal.length > 0) {
                tendered = Number(newVal[0].tendered) + Number(newVal[0].total_amount)
                t = newVal
            } else {
                this.tendered = 0
                this.transactions.value = structuredClone(this.transactions.last ? this.transactions.last : [])
                this.transactions.last = null
                return
            }
            this.transactions.history = structuredClone(newVal)
            if (this.transactions.last === null)
                this.transactions.last = structuredClone(this.transactions.value)
            this.tendered = tendered
            this.transactions.value = t
            this.isNewTransaction = false
        },
        cancelTransaction() {
            this.transactions.value = []
            this.show.cancel = false
        },
        goToSales() {
            this.show.goToSales = false
            if (this.$route.path !== '/pos/sales') this.$router.push('/pos/sales')
        },
        closeEditCurrentItem() {
            this.show.editItem = false
        },
        closechangeAmount() {
            this.tendered = 0
            this.show.change = false
            this.transactions.value = []
            this.getNextSalesId()
        },
        closeNotif() {
            this.show.error = false
            this.show.errorData = { message: '' }
        },
        async saveTransaction(data) {
            await this.getCsrfToken()
            this.tendered = data.tendered
            const args = { totalAmount: this.totalAmount, ...data, register_cash_flow_id: Number(window.$cookies.get('cash_register_recorded_id')), employee_id:  Number(window.$cookies.get('userId')) }

            if (this.isNewTransaction)
                this.saveSales({items: this.transactions.value, ...args})
            else {
                const newArr = utils.getChanges(this.transactions.history, this.transactions.value)
                this.saveSalesModified({items: newArr, ...args})
            }
        },
        focusToBarcode() {
            this.focus.barcode = true
        },
        saveBarcodeQuantity(data) {
            // Add "currentTransaction" class to the new item and remove it from others
            this.transactions.value.forEach((item) => {
                item.isCurrent = false; // Remove class from others
            });

            // Find the index of the existing product in transactions
            const existingProductIndex = this.transactions.value.findIndex(item => item.product_id === data.product_id);
            if (existingProductIndex !== -1) {
                // If the product exists, update its quantity
                const existingProduct = this.transactions.value[existingProductIndex];

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
                this.transactions.value.push(data);
            }
        },
        handleKeyPress(event) {
            if (event.key === "Enter" && this.show.error) {
                event.preventDefault()
                this.closeNotif()
            }
            if (event.key === "Enter" && this.show.change) {
                event.preventDefault()
                this.closechangeAmount()
                this.show.change = false
            }
            if (event.key === "F1") {
                event.preventDefault()
                if (this.show.goToSales)
                    this.show.goToSales = false
                else if (this.transactions.value.length > 0)
                    this.show.goToSales = true
                else if (this.$route.path !== '/pos/sales') this.$router.push('/pos/sales')
            }
            if (event.key === 'F2')
                if (this.$route.path !== '/pos') this.$router.push('/pos')
            if (event.key === "F7") {
                event.preventDefault()
                if (this.show.cancel)
                    this.cancelTransaction()
                else if (this.transactions.value.length > 0)
                    this.show.cancel = true
            }
            // if (event.key === "F6") {
            //     event.preventDefault()
            //     if (this.$route.path !== '/pos') window.location.href = '/pos'
            // }
            if (event.key === "F11") {
                event.preventDefault()
                this.handleF11Func()
            }
            if (event.key === "ArrowUp" && this.isSearchIsEmptyVar) {
                event.preventDefault()
                this.triggerBlurBarcode++
                if (this.transactions.value.length > 0) {
                    const existingProductIndex = this.transactions.value.findIndex(item => item.isCurrent === true)
                    if (existingProductIndex > -1) {
                        // Use Vue’s reactivity system by creating a new array reference
                        this.transactions.value = this.transactions.value.map((item, index) => ({
                            ...item,
                            isCurrent: index === existingProductIndex - 1
                        }));
                    } else {
                        const lastTransElement = { ...this.transactions.value[this.transactions.value.length - 1], isCurrent: true, isPrinting: false };

                        this.transactions.value.pop();
                        this.transactions.value = [...this.transactions.value, lastTransElement];
                    }
                }
            }
            if (event.key === "ArrowDown" && this.isSearchIsEmptyVar) {
                event.preventDefault()
                this.triggerBlurBarcode++
                if (this.transactions.value.length > 0) {
                    const existingProductIndex = this.transactions.value.findIndex(item => item.isCurrent === true);
                    if (existingProductIndex > -1) {
                        // Use Vue’s reactivity system by creating a new array reference
                        this.transactions.value = this.transactions.value.map((item, index) => ({
                            ...item,
                            isCurrent: index === existingProductIndex + 1
                        }));
                    } else {
                        const firstElement = { ...this.transactions.value[0], isCurrent: true, isPrinting: false };

                        this.transactions.value.shift();
                        this.transactions.value = [firstElement, ...this.transactions.value];
                    }
                }
            }
        },
    },
    mounted() {
        this.getNextSalesId()
        this.companyProfiles()
        this.cashierName = window.$cookies.get('name')
        window.addEventListener("keydown", this.handleKeyPress);
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeyPress);
    },
}
</script>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'); */

.poppins-regular {
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-style: normal;
}
.title1 {
    font-size: 21px;
}
</style>

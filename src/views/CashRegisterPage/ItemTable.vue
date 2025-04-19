<template>
    <div>
        <div style="position: relative;">
            <v-btn
                :disabled="isLoading"
                icon
                text
                :ripple="false"
                style="position: absolute; left: 40px; top: 113px;"
                @click="retrieveTrans('left')"
            >
                <v-icon style="font-size: 170px; background-color: transparent;">
                    mdi-menu-left
                </v-icon>
            </v-btn>
            <v-btn
                :disabled="isLoading || isNewTransaction"
                icon
                text
                :ripple="false"
                style="position: absolute; right: 40px; top: 113px;"
                @click="retrieveTrans('right')"
            >
                <v-icon style="font-size: 170px; background-color: transparent;">
                    mdi-menu-right
                </v-icon>
            </v-btn>
        </div>
        <v-data-table
            :items="items.filter(item => item.itemQuantity > 0)"
            hide-default-footer
            :item-class="getRowClass"
            :items-per-page="-1"
            dense
        >
            <template v-slot:body="{items}">
                <div style="width: 350px; height: 90vh; margin: 0 auto; overflow-y: scroll; overflow-x: hidden;">
                    <div id="printableArea">
                        <p>{{ companyProfilesData && companyProfilesData.DATA[0].name }}</p>
                        <p v-if="address1">{{ address1 }}</p>
                        <p v-if="address2">{{ address2 }}</p>
                        <p class="text--center">-----------------------</p>
                        <p>ORDER SLIP ONLY</p>
                        <p>(Unofficial Receipt)</p><p class="text--center">-----------------------</p>
                        <p>Transaction#: {{ sales_id && sales_id.last && sales_id.status === 'history' ? sales_id.last : sales_id.value + 1 }}</p>
                        <p>Date & Time: {{ salesDateTime ? salesDateTime : dateTimeVar }}</p>
                        <p>Cashier: {{ cashierName }}</p>
                        <p class="text--center">=======================</p>
                        <table style="width: 100%; border-collapse: collapse; border: none;">
                            <thead>
                                <div class="parent-div">
                                    <tr>
                                        <td style="text-align: right; width: 35px">QTY</td>
                                        <td style="width: 343px;">&nbsp;DESCRIPTION</td>
                                        <td style="text-align: right; width: 84px;">AMOUNT</td>
                                    </tr>
                                </div>
                            </thead>
                            <tbody>
                                <div v-for="(item, index) in items" :key="index">
                                    <tr :id="item.isCurrent && !item.isPrinting ? 'topMost' : ''" :style="{backgroundColor: item.isCurrent && !item.isPrinting ? 'blue' : index % 2 == 0 ? '#ddd' : 'white' , color: item.isCurrent && !item.isPrinting ? 'white' : 'black'}">
                                        <td style="text-align: left; width: 35px; border: none;">{{ item.itemQuantity }}</td>
                                        <td style="width: 343px; padding-right: 5px;">{{ itemName(`${item.brand} ${item.name} ${item.unit}`) }}</td>
                                        <td style="text-align: right; width: 84px">{{ amountEachItem(item) }}</td>
                                    </tr>
                                    <tr v-if="item.itemQuantity > 1" :style="{backgroundColor: item.isCurrent && !item.isPrinting ? 'blue' : index % 2 == 0 ? '#ddd' : 'white' , color: item.isCurrent && !item.isPrinting ? 'white' : 'black'}">
                                        <td colspan="3" style="border: none" class="sellingPrice">@{{ Number(item.selling_price).toFixed(2) }}</td>
                                    </tr>
                                </div>
                            </tbody>
                        </table>
                        <p class="text--center">=======================</p>
                        <p style="text-align: left; position: relative;">Total QTY: <span style="position: absolute; right: 0;">{{ overAllQuantity }}</span></p>
                        <p id="amountDue" style="text-align: left; position: relative;" >AMOUNT DUE: <span style="position: absolute; right: 0;">{{ overAllAmount }}</span></p>
                        <p style="text-align: left; position: relative;">Cash <span style="position: absolute; right: 0;">{{ cashAmount }}</span></p>
                        <p style="text-align: left; position: relative;">Change: <span style="position: absolute; right: 0;">{{ changeAmount.toFixed(2) }}</span></p>
                        <p>***</p>
                        <p style="text-align: center">Thank you ... </p>
                        <p style="text-align: center">Please come again ...</p>
                    </div>
                </div>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
export default {
    data: () => ({
        isLoading: false,
        dateTimeVar: moment().format('YYYY-M-D HH:mm:ss'),
        itemsBeforePrint: [],
        items: [],
        salesDateTime: null,
        sales_id: {
            status: 'current',
            value: null,
            last: null,
        },
    }),
    props: ['isNewTransaction', 'transactions', 'tendered', 'onClickFunc'],
    computed: {
        ...mapGetters(['getNextSalesIdData', 'retriveTransactionData', 'companyProfilesData']),
        address2() {
            return this.companyProfilesData && this.companyProfilesData.DATA[0].address2
        },
        address1() {
            return this.companyProfilesData && this.companyProfilesData.DATA[0].address1
        },
        changeAmount() {
            const changeVal = (Number(this.tendered) - this.overAllAmount)
            return changeVal > 0 ? changeVal : 0
        },
        cashAmount() {
            return Number(this.tendered).toFixed(2)
        },
        overAllAmount() {
            const test = this.items.reduce((sum, item) => {
                return (Number(sum) + Number(item.itemQuantity) * Number(item.selling_price))
            }, 0).toFixed(2)
            return test
        },
        overAllQuantity() {
            const test = this.items.reduce((sum, item) => {
                return (Number(sum) + Number(item.itemQuantity))
            }, 0)
            return test
        },
        cashierName() {
            return window.$cookies.get('name').toUpperCase()
        }
    },
    watch: {
        onClickFunc: {
            handler(newVal) {
                const BtnShortcuts = Object.keys(newVal)
                for (let i=0; i<BtnShortcuts.length; i++) {
                    if (newVal[BtnShortcuts[i]] === true) {
                        if (BtnShortcuts[i] === 'f4') {
                            this.$nextTick(()=>{
                            this.items.forEach((item) => {
                                item.isPrinting = true
                            });
                            this.$nextTick(()=>{
                                window.print()
                                this.items.forEach((item) => {
                                    item.isPrinting = false
                                });
                            })
                        })
                        }
                    }
                }
            },
            immediate: true,
            deep: true
        },
        retriveTransactionData(newVal) {
            this.isLoading = false
            if (newVal.STATUS === 200) {
                if (newVal && newVal.DATA && newVal.DATA.length > 0) {
                    this.salesDateTime = moment(newVal.DATA[0].salesDateTime).format('YYYY-M-D HH:mm:ss')
                    this.$emit('renderLastTrans', newVal && newVal.DATA ? newVal.DATA : [])
                    return
                }
            }
            this.sales_id.status = 'current'
            this.salesDateTime = null
            this.sales_id.last = null
            this.$emit('renderLastTrans', [])
            this.$emit('renderNewTrans')
        },
        getNextSalesIdData(newVal) {
            this.sales_id.value = newVal && newVal.DATA ? Number(newVal.DATA) : 1
        },
        transactions: {
            handler(newVal) {
                if (newVal) {
                    this.$nextTick(()=>{
                        const test = document.getElementById('topMost');
                        if (test) test.scrollIntoView({ behavior: "auto", block: "start" });
                    })
                    this.items = newVal
                } else {
                    console.error(newVal.STATE)
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        ...mapActions(['retriveTransaction', 'getNextSalesId']),
        retrieveTrans(direction) {
            // Set loading state to true
            this.isLoading = true;

            // Determine if it's a new or existing transaction
            if (!this.isNewTransaction) {
                // For existing transactions, increment or decrement 'last' based on direction
                this.sales_id.last = this.sales_id.last
                    ? this.sales_id.last + (direction === 'left' ? -1 : 1)  // Increment or decrement the 'last' value
                    : this.sales_id.value + (direction === 'left' ? -1 : 1);  // If 'last' is undefined, use 'value' and adjust
            } else {
                // For new transactions, adjust 'last' value with the direction
                this.sales_id.last = this.sales_id.last
                    ? (direction === 'left' ? this.sales_id.last : this.sales_id.last + 1)  // Only increment if direction is right
                    : (direction === 'left' ? this.sales_id.value : this.sales_id.value + 1);  // If 'last' is undefined, use 'value'
            }

            const newSales = {status:  'history', last: this.sales_id.last, value: this.sales_id.value}
            this.sales_id = newSales
            this.retriveTransaction({ sales_id: this.sales_id.last, direction })
        },
        itemName(item) {
            return item.toUpperCase()
        },
        getRowClass(item) {
            return item.isCurrent ? 'current-row' : '';
        },
        amountEachItem(item) {
            const amount = parseFloat(item.selling_price) * parseFloat(item.itemQuantity)
            return amount ? amount.toFixed(2) : null
        },
        handleKeyPress(event) {
            if (event.key === "F6") {
                event.preventDefault(); // Prevent default browser behavior
                const indexOfTaret = this.items.findIndex(item => item.isCurrent === true)
                if (indexOfTaret !== -1) {
                    this.items.splice(indexOfTaret, 1)
                    if (this.items.length > 0)
                        this.items[indexOfTaret]
                            ? this.items[indexOfTaret].isCurrent = true
                            : this.items[indexOfTaret - 1].isCurrent = true
                }
            }
            if (event.key === "F4") {
                this.$nextTick(()=>{
                    event.preventDefault()
                    this.items.forEach((item) => {
                        item.isPrinting = true
                    });
                    this.$nextTick(()=>{
                        window.print()
                        this.items.forEach((item) => {
                            item.isPrinting = false
                        });
                    })
                })
            }
            if (event.key === "p" || event.key === "P") {
                this.$nextTick(()=>{
                    if (this.show.payment) {
                        event.preventDefault()
                        this.items.forEach((item) => {
                            item.isPrinting = true
                        });
                        this.$nextTick(()=>{
                            window.print()
                            this.items.forEach((item) => {
                                item.isPrinting = false
                            });
                        })
                    }
                })
            }
        },
    },
    mounted() {
        setInterval(()=>{
            this.dateTimeVar = moment().format('YYYY-M-D HH:mm:ss')
        }, 1000)
        window.addEventListener("keydown", this.handleKeyPress);
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeyPress);
    },
}
</script>

<style>
@media print {
    body {
        visibility: hidden;
    }
    #printableArea {
        visibility: visible;
        position: absolute;
        left: 0px;
        top: -700px;
        font-size: 17px;
        width: 220px;
    }

        #printableArea .sellingPrice {
            /* padding-right: 0; */
            /* text-align: right; */
        }
}
/* .v-data-table > .v-data-table__wrapper > table > thead > tr > th, span
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td, span {
  font-size: 20px;
}
.v-data-table >>> tr.current-row {
    background-color: blue !important;
    font-weight: bold;
    border: 2px solid #007bff;
    color: white;
} */
#printableArea div tr td {
    line-height: 1;
}
#printableArea table thead div tr, #printableArea table thead div tr td,
#printableArea table div tr, #printableArea table div tr td, #printableArea table {
    /* border: 0 solid white; Change border color */
    border: none !;
}
#printableArea {
    font-family: monospace;
}
#printableArea #amountDue {
    font-size: 24px;
}
#printableArea .sellingPrice {
    text-align: right;
    padding-right: 130px;
}
#printableArea p {
    text-align: center;
    margin: 0 auto;
    line-height: 1;
}
</style>

<template>
    <div>
        <div style="position: relative;">
            <v-btn
                icon
                text
                :ripple="false"
                style="position: absolute; left: 40px; top: 113px;"
                @click="retrieveTrans"
            >
                <v-icon style="font-size: 170px; background-color: transparent;">
                    mdi-menu-left
                </v-icon>
            </v-btn>
            <v-btn
                icon
                text
                :ripple="false"
                style="position: absolute; right: 40px; top: 113px;"
                @click="test('right')"
            >
                <v-icon style="font-size: 170px; background-color: transparent;">
                    mdi-menu-right
                </v-icon>
            </v-btn>
        </div>
        <v-data-table
            :items="items"
            hide-default-footer
            :item-class="getRowClass"
            :items-per-page="-1"
            dense
        >
            <template v-slot:body="{items}">
                <div id="printableArea" style="width: 430px; height: 90vh; margin: 0 auto; overflow-y: scroll; overflow-x: hidden;">
                    <p>4-D CONVENIENCE STORE</p>
                    <p>B-HIVE STORE, BARANGAY BANAGO</p>
                    <p>NAGCARLAN, LAGUNA</p>
                    <p>-------------------------------</p>
                    <p>UNOFFICIAL RECEIPT</p>
                    <p>-------------------------------</p>
                    <p>Transaction#: {{ sales_id && sales_id.last && sales_id.status === 'history' ? sales_id.last : sales_id.value + 1 }}</p>
                    <p>Date & Time: {{ salesDateTime ? salesDateTime : dateTimeVar }}</p>
                    <p>Cashier: SUSAN</p>
                    =======================================
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
                                    <td style="text-align: right; width: 35px; border: none;">{{ item.itemQuantity }}</td>
                                    <td style="width: 343px">&nbsp;{{ itemName(item.name) }}</td>
                                    <td style="text-align: right; width: 84px">{{ amountEachItem(item) }}</td>
                                    <!-- <td style="text-align: right;">{{ item.selling_price }}</td> -->
                                </tr>
                                <tr v-if="item.itemQuantity > 1" :style="{backgroundColor: item.isCurrent && !item.isPrinting ? 'blue' : index % 2 == 0 ? '#ddd' : 'white' , color: item.isCurrent && !item.isPrinting ? 'white' : 'black'}">
                                    <td colspan="3" style="text-align: right; padding-right: 180px; border: none">@{{ Number(item.selling_price).toFixed(2) }}</td>
                                </tr>
                            </div>
                        </tbody>
                    </table>
                    =======================================
                    <p style="text-align: left; position: relative;">Total QTY: <span style="position: absolute; right: 0;">{{ overAllQuantity }}</span></p>
                    <p style="text-align: left; position: relative; font-size: 27px;">AMOUNT DUE: <span style="position: absolute; right: 0;">{{ overAllAmount }}</span></p>
                    <p style="text-align: left; position: relative;">Cash <span style="position: absolute; right: 0;">{{ cashAmount }}</span></p>
                    <p style="text-align: left; position: relative;">Change: <span style="position: absolute; right: 0;">{{ changeAmount.toFixed(2) }}</span></p>
                    <p>***</p>
                    <p>Thank you ... Please come again ...</p>
                </div>
            </template>
            <!-- <template slot="item.name" slot-scope="{ item }">
                <span style="text-wrap: nowrap;">{{ item.name }}</span>
            </template>
            <template slot="item.amount" slot-scope="{ item }">
                <span style="text-wrap: nowrap;">{{ amountEachItem(item) }}</span>
            </template> -->
        </v-data-table>
    </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
export default {
    data: () => ({
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
    computed: {
        ...mapGetters(['getNextSalesIdData', 'retriveTransactionData']),
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
    },
    props: ['transactions', 'tendered'],
    watch: {
        retriveTransactionData(newVal) {
            if (newVal.STATUS === 200) {
                if (newVal && newVal.DATA && newVal.DATA.length > 0) {
                    this.salesDateTime = moment(newVal.DATA[0].salesDateTime).format('YYYY-M-D HH:mm:ss')
                    this.$emit('renderLastTrans', newVal && newVal.DATA)
                    return
                }
            }
            this.sales_id.status = 'current'
            this.salesDateTime = null
            this.$emit('renderLastTrans', [])
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
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        ...mapActions(['retriveTransaction']),
        retrieveTrans() {
            this.sales_id.last = this.sales_id.last ? this.sales_id.last - 1 : this.sales_id.value - 1
            const newSales = {status:  'history', last: this.sales_id.last, value: this.sales_id.value}
            this.sales_id = newSales
            this.retriveTransaction({ sales_id: this.sales_id.last })
        },
        test(btn) {
            console.log('methods test btn: ', btn)
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
            if (event.altKey && event.key === "d" || event.altKey && event.key === "D") {
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
            if (event.key === "p" || event.key === "P") {
                this.$nextTick(()=>{
                    event.preventDefault()
                    // Listen for beforeprint and afterprint events
                    // window.addEventListener("beforeprint", this.onBeforePrint);
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
        left: 0;
        top: 0;
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
#printableArea p {
    text-align: center;
    margin: 0 auto;
    line-height: 1;
}
</style>

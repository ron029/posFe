<template>
    <div>
        <v-data-table
            :items="items"
            :headers="headers.transactions"
            style="height: 90vh; font: 20px; overflow-y: scroll; overflow-x: hidden;"
            hide-default-footer
            :item-class="getRowClass"
            :items-per-page="-1"
            dense
        >
            <template v-slot:body="{items}">
                <div id="printableArea" style="width: 430px; margin: 0 auto;">
                    <p>4-D CONVENIENCE STORE</p>
                    <p>B-HIVE STORE, BARANGAY BANAGO</p>
                    <p>NAGCARLAN, LAGUNA</p>
                    <p>-------------------------------</p>
                    <p>UNOFFICIAL RECEIPT</p>
                    <p>-------------------------------</p>
                    <p>Transaction#: 67790</p>
                    <p>Date & Time: {{ dateTimeVar }}</p>
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
export default {
    data: () => ({
        dateTimeVar: moment().format('YYYY-M-D HH:mm:ss'),
        headers: {
            transactions: [
                // { text: 'Description', value: 'name'},
                // { text: 'Qty', value: 'itemQuantity'},
                // // { text: 'Unit', value: 'unit'},
                // { text: 'Selling Price', value: 'selling_price'},
                // { text: 'Amount', value: 'amount'},
            ],
        },
        itemsBeforePrint: [],
        items: []
    }),
    computed: {
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
        transactions: {
            handler(newVal) {
                console.log('watch transactions newVal: ', newVal)
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

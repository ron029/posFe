<template>
    <div>
        <v-data-table
            :items="transactions"
            :headers="headers.transactions"
            style="height: 400px; font: 20px; overflow-y: scroll;"
            hide-default-footer
            :item-class="getRowClass"
            :items-per-page="-1"
            dense
        >
            <template v-slot:body="{items}">
                <div id="printableArea">
                    <p>4-D CONVENIENCE STORE</p>
                    <p>B-HIVE STORE, BARANGAY BANAGO, NAGCARLAN, LAGUNA</p>
                    <p>UNOFFICIAL RECEIPT</p>
                    <p>------------------------------------------------------------</p>
                    <p>TRANSACTION # 67790</p>
                    <p>DATE & TIME: 2025-1-15 22:06:47</p>
                    <p>Cashier: SUSAN</p>
                    <table style="width: 100%;">
                        <thead>
                            <div class="parent-div">
                                <tr>
                                    <td>ITEM</td>
                                    <td style="text-align: center;">QUANTITY</td>
                                    <td style="text-align: right;" >PRICE</td>
                                    <td style="text-align: right;">AMOUNT</td>
                                </tr>
                            </div>
                        </thead>
                        ==========================================================================
                        <div v-for="(item, index) in items" :key="index">
                            <tr>
                                <td colspan="4">{{ item.name }}</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                                <td style="text-align: center;">{{ item.itemQuantity }}</td>
                                <td style="text-align: right;">{{ item.selling_price }}</td>
                                <td style="text-align: right;">{{ amountEachItem(item) }}</td>
                            </tr>
                        </div>
                    </table>
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
export default {
    data: () => ({
        headers: {
            transactions: [
                // { text: 'Description', value: 'name'},
                // { text: 'Qty', value: 'itemQuantity'},
                // // { text: 'Unit', value: 'unit'},
                // { text: 'Selling Price', value: 'selling_price'},
                // { text: 'Amount', value: 'amount'},
            ],
        },
        items: []
    }),
    props: ['transactions'],
    watch: {
        transactions: {
            handler(newVal) {
                if (newVal) this.items = newVal
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        getRowClass(item) {
            return item.isCurrent ? 'current-row' : '';
        },
        amountEachItem(item) {
            const amount = parseFloat(item.selling_price) * parseFloat(item.itemQuantity)
            return amount ? amount.toFixed(2) : null
        },
        handleKeyPress(event) {
            if (event.key === "p" || event.key === "P") {
                console.log('handleKeyPress')
                event.preventDefault()
                window.print()
            }
        },
    },
    mounted() {
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
#printableArea table div tr td {
    width: 210px;
}
#printableArea p {
    text-align: center;
}
</style>

<template>
    <v-data-table
        :items="transactions"
        :headers="headers.transactions"
        style="height: 400px; font: 20px; overflow-y: scroll;"
        hide-default-footer
        :item-class="getRowClass"
        :items-per-page="-1"
        dense
    >
        <template slot="item.name" slot-scope="{ item }">
            <span style="text-wrap: nowrap;">{{ item.name }}</span>
        </template>
        <template slot="item.amount" slot-scope="{ item }">
            <span style="text-wrap: nowrap;">{{ amountEachItem(item) }}</span>
        </template>
    </v-data-table>
</template>

<script>
export default {
    data: () => ({
        headers: {
            transactions: [
                { text: 'Description', value: 'name'},
                { text: 'Qty', value: 'itemQuantity'},
                { text: 'Unit', value: 'unit'},
                { text: 'Selling Price', value: 'selling_price'},
                { text: 'Amount', value: 'amount'},
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
    }
}
</script>

<style scoped>
.colorBlue {
    color:blue
}
.v-data-table > .v-data-table__wrapper > table > thead > tr > th, span
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td, span {
  font-size: 20px; /* Adjust the size as needed */
}
.v-data-table >>> tr.current-row {
    background-color: blue !important;
    font-weight: bold;
    border: 2px solid #007bff;
    color: white;
}
</style>

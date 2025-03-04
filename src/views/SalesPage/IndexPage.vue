<template>
    <div style="padding: 0 20px">
        <h1>Sales</h1>
        <v-card style="min-width: fit-content; display: inline-block;" class="elevation-5">
            <v-card-text>
                <v-text-field
                    style="display: inline-block; width: 200px; margin-right: 10px;"
                    v-model="date.from"
                    type="date"
                    label="Start Date"
                    outlined
                    hide-details
                ></v-text-field>
                <v-text-field
                    style="display: inline-block; width: 200px;"
                    v-model="date.to"
                    type="date"
                    label="End Date"
                    outlined
                    hide-details
                ></v-text-field>
            </v-card-text>
        </v-card>
        <v-card style="margin-top: 20px; padding: 10px 0" class="elevation-5">
                <v-data-table
                    :headers="headers"
                    :items="fetchSalesData?.DATA"
                    dense
                    bordered
                >
                    <template slot="top">
                        <p class="text-center">Summary Per Sales Transaction</p>
                    </template>
                    <template slot="item.transaction_date" slot-scope="{ item }">
                        <span style="text-wrap: nowrap;">{{ formatDate(item.transaction_date) }}</span>
                    </template>
                    <template slot="item.total_after_discount" slot-scope="{ item }">
                        <span style="text-wrap: nowrap; font-weight: 700;">{{ item.total_after_discount }}</span>
                    </template>
                    <template slot="item.actions" slot-scope="{ item }">
                        <span style="text-wrap: nowrap; font-weight: 700;"><v-btn color="error" small><v-icon size="15">mdi-close</v-icon>&nbsp;cancel</v-btn>{{ item.actions }}</span>
                    </template>
                    <template slot="item.subtotal" slot-scope="{ item }">
                        <span style="text-wrap: nowrap; font-weight: 700;">{{ item.subtotal }}</span>
                    </template>
                    <template slot="item.change_due" slot-scope="{ item }">
                        <span style="text-wrap: nowrap;">{{ Number(item.change_due).toFixed(2) }}</span>
                    </template>
                </v-data-table>
                <p class="text-center">
                    <!-- <span style="display: block;">Subtotal: <v-icon>mdi-currency-php</v-icon> {{ subtotal.toFixed(2) }}</span> -->
                    <span style="display: block; font-size: 24px; font-weight: 700;">Total: <v-icon>mdi-currency-php</v-icon> {{ total?.toFixed(2) }}</span>
                    <!-- <span style="display: block;">Profit: <v-icon>mdi-currency-php</v-icon> {{ profit.toFixed(2) }}</span> -->
                </p>
        </v-card>
    </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
export default {
    data: () => ({
        date: {
            from: moment().format('YYYY-MM-DD'),
            to: moment().format('YYYY-MM-DD')
        },
        headers: [
        { text: 'Sales ID', value: 'sales_id'},
        { text: 'Transaction Date', value: 'transaction_date'},
        { text: 'Cashier', value: 'name'},
        // { text: 'Total Cost', value: 'total_cost', align: 'right'},
        // { text: 'Profit', value: 'profit', align: 'right'},
        { text: 'Total', value: 'subtotal', align: 'right'},
        // { text: 'Discount', value: 'discount', align: 'right'},
        // { text: 'Total w/ Disc.', value: 'total_after_discount', align: 'right'},
        { text: 'Tendered', value: 'tendered', align: 'right'},
        { text: 'Change', value: 'change_due', align: 'right'},
        // { text: 'Actions', value: 'actions'},
        ],
    }),
    computed: {
        ...mapGetters(['fetchSalesData']),
        subtotal() {
            return this.fetchSalesData?.DATA.reduce((subtotal, item) => {
                return subtotal + parseFloat(item.subtotal)
            }, 0);
        },
        total() {
            return this.fetchSalesData?.DATA.reduce((subtotal, item) => {
                return subtotal + parseFloat(item.total_after_discount)
            }, 0);
        },
        profit() {
            return this.fetchSalesData?.DATA.reduce((profit, item) => {
                return profit + parseFloat(item.profit)
            }, 0);
        }
    },
    watch: {
        async 'date.from'(newVal) {
            if (newVal) {
                await this.getCsrfToken()
                this.fetchSales({from: newVal, to: this.date.to})
            }
        },
        async 'date.to'(newVal) {
            if (newVal) {
                await this.getCsrfToken()
                this.fetchSales({from: this.date.from, to: newVal})
            }
        },
        fetchSalesData(newVal) {
            if (newVal) this.fetchSalesData
        }
    },
    methods: {
        ...mapActions(['getCsrfToken', 'fetchSales']),
        formatDate(date) {
            return moment(date).format('MMM D, YYYY')
        },
        changeDue(item) {
            return item.total_after_discount - item.tendered
        }
    },
    async mounted() {
        await this.getCsrfToken()
        this.fetchSales(this.date)
    }
}
</script>

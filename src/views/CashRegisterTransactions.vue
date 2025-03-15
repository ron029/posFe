<template>
    <v-dialog
        v-model="showCashRegisterRecorder"
        persistent
        width="600"
    >
        <v-card>
            <v-form
                v-model="valid"
                ref="form"
                @submit.prevent="submitCashRegister()"
            >
                <v-card-title style="background-color: blue; color: white">Cash Register
                    <v-spacer></v-spacer>
                    <!-- <v-btn
                        outlined
                        @click="$emit('closeCashRegisterTransactions')"
                        small
                        color="white"
                    >ESC</v-btn> -->
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="6">
                            <ul style="list-style-type: none; padding-left: 0;">
                                <li>{{ user.timeIn ? formatTimeCard(user.timeIn) : '' }}</li>
                                <li>{{ user.timeOut ? formatTimeCard(user.timeOut) : '' }}</li>
                                <li>{{ user.name }}</li>
                            </ul>
                        </v-col>
                        <v-col cols="6">
                            <ul style="list-style-type: none; padding-left: 0;">
                                <li>Total Opening:
                                    <v-chip
                                        small
                                        :color="totalOpeningColor"
                                    >PHP {{ totalAmountOpeningDisplay }}</v-chip>
                                </li>
                                <li>Total Closing:
                                    <v-chip
                                        small
                                        :color="totalClosingColor"
                                    >PHP {{ totalAmountClosingDisplay }}</v-chip>
                                </li>
                                <li><v-chip v-if="mode === 'out'" small :color="discrepancyColor">{{ discrepancyMessage  }}</v-chip></li>
                            </ul>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <p style="max-width: 150px; width: 100%; text-align: right; position: relative;">
                                <span style="position: absolute; left: 0;">Bills</span>
                                <span>{{ this.total.bill_ ? this.total.bill_?.toLocaleString() : 0 }}</span>
                            </p>
                            <CashQuantityInput
                                label="1000"
                                @deno="(value) => saveData('bill_1000', value, 'bill_')"
                            />
                            <CashQuantityInput
                                label="500"
                                @deno="(value) => saveData('bill_500', value, 'bill_')"
                            />
                            <CashQuantityInput
                                label="200"
                                @deno="(value) => saveData('bill_200', value, 'bill_')"
                            />
                            <CashQuantityInput
                                label="100"
                                @deno="(value) => saveData('bill_100', value, 'bill_')"
                            />
                            <CashQuantityInput
                                label="50"
                                @deno="(value) => saveData('bill_50', value, 'bill_')"
                            />
                            <CashQuantityInput
                                label="20"
                                @deno="(value) => saveData('bill_20', value, 'bill_')"
                            />
                        </v-col>
                        <v-col cols="4">
                            <p style="max-width: 150px; width: 100%; text-align: right; position: relative;">
                                <span style="position: absolute; left: 0;">Coins</span>
                                <span>{{ this.total.coin_ ? this.total.coin_?.toLocaleString() : 0 }}</span>
                            </p>
                            <CashQuantityInput
                                label="20"
                                @deno="(value) => saveData('coin_20', value, 'coin_')"
                            />
                            <CashQuantityInput
                                label="10"
                                @deno="(value) => saveData('coin_10', value, 'coin_')"
                            />
                            <CashQuantityInput
                                label="5"
                                @deno="(value) => saveData('coin_5', value, 'coin_')"
                            />
                            <CashQuantityInput
                                label="1"
                                @deno="(value) => saveData('coin_1', value, 'coin_')"
                            />
                        </v-col>
                        <v-col cols="4">
                            <p style="max-width: 150px; width: 100%; text-align: right; position: relative;">
                                <span style="position: absolute; left: 0;">Sentimo</span>
                                <span>{{ this.total.sentimo_ ? this.total.sentimo_?.toLocaleString() : 0 }}</span>
                            </p>
                            <CashQuantityInput
                                label=".25"
                                @deno="(value) => saveData('sentimo_25', value, 'sentimo_')"
                            />
                            <CashQuantityInput
                                label=".10"
                                @deno="(value) => saveData('sentimo_10', value, 'sentimo_')"
                            />
                            <CashQuantityInput
                                label=".05"
                                @deno="(value) => saveData('sentimo_5', value, 'sentimo_')"
                            />
                            <CashQuantityInput
                                label=".01"
                                @deno="(value) => saveData('sentimo_1', value, 'sentimo_')"
                            />
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" type="submit">submit</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import moment from 'moment';
import CashQuantityInput from '@/components/CashQuantityInput.vue';
import { mapActions, mapGetters } from 'vuex';
export default {
    components: {
        CashQuantityInput,
    },
    data: () => ({
        discrepancyColor: 'secondary',
        sales: null,
        user: {
            name: null,
            timeIn: null,
            timeOut: null,
        },
        valid: false,
        total: {
            bill_: null,
            coin_: null,
            sentimo_: null
        },
        data: {
            register: {
                employee_id: Number(window.$cookies.get('userId')),
                discrepancy: 0,
                opening_amount: 0,
                closing_amount: 0,
            },
            deno: {
                register_cash_flow_id: null,
                bill_1000: null,
                bill_500: null,
                bill_200: null,
                bill_100: null,
                bill_50: null,
                bill_20: null,
                coin_20: null,
                coin_10: null,
                coin_5: null,
                coin_1: null,
                sentimo_25: null,
                sentimo_10: null,
                sentimo_5: null,
                sentimo_1: null,
                isTimeIn: null
            }
        },
        denoValues: {
            bill_1000: 1000,
            bill_500: 500,
            bill_200: 200,
            bill_100: 100,
            bill_50: 50,
            bill_20: 20,
            coin_20: 20,
            coin_10: 10,
            coin_5: 5,
            coin_1: 1,
            sentimo_25: 0.25,
            sentimo_10: 0.10,
            sentimo_5: 0.05,
            sentimo_1: 0.01,
        }
    }),
    props: ['show', 'mode'],
    computed: {
        ...mapGetters(['registerCashFlowData', 'getExistingCashFlowData', 'fetchSalesBySessionData']),
        discrepancy() {
            if (this.mode === 'out' && this.data.register.opening_amount && this.sales) {
                const openingAndSales = parseFloat(this.data.register.opening_amount) + parseFloat(this.sales)
                return openingAndSales - this.totalAmount
            } else {
                return '0.00'
            }
        },
        discrepancyMessage() {
            if (this.discrepancy < 0) {
                this.assignDiscrepancyColor('success')
                // Overage: More cash than expected
                return `Overage: PHP ${Math.abs(this.discrepancy).toFixed(2)}`;
            } else if (this.discrepancy > 0) {
                this.assignDiscrepancyColor('error')
                // Shortage: Less cash than expected
                return `Shortage: PHP ${this.discrepancy.toFixed(2)}`;
            } else {
                this.assignDiscrepancyColor('success')
                // Balanced: Cash is exactly as expected
                return 'Balanced: PHP 0.00';
            }
        },
        totalOpeningColor() {
            if (this.data.register.opening_amount) {
                return 'success'
            }
            if (this.mode === 'in' && Number(this.totalAmount) > 0) {
                return 'success'
            } else {
                return 'error'
            }
        },
        totalClosingColor() {
            if (this.data.register.closing_amount) {
                return 'success'
            }
            if (this.mode === 'out' && Number(this.totalAmount) > 0) {
                return 'success'
            } else {
                return 'error'
            }
        },
        totalAmountOpeningDisplay() {
            if (this.mode === 'in') {
                return this.totalAmount ? this.formatAmount(this.totalAmount) : '0.00'
            } else if (this.mode === 'out') {
                return this.data.register.opening_amount
            } else {
                return '0.00'
            }
        },
        totalAmountClosingDisplay() {
            if (this.mode === 'in') {
                return this.data.register.closing_amount
            } else if (this.mode === 'out') {
                return this.totalAmount ? this.formatAmount(this.totalAmount) : '0.00'
            } else {
                return '0.00'
            }
        },
        showCashRegisterRecorder: {
            get() {
                return this.show
            }
        },
        totalAmount() {
            let total = 0;

            for (const [key, value] of Object.entries(this.denoValues)) {
                total += (this.data.deno[key] || 0.00) * value; // Multiply the quantity by its bill value
            }
            if (!total) return 0
            return total
        },
    },
    watch: {
        async registerCashFlowData(newVal) {
            if (newVal.STATUS === 200 && this.mode === 'out') {
                await this.getCsrfToken()
                this.logout()
            }
        },
        fetchSalesBySessionData(newVal) {
            if (newVal.STATUS === 200) {
                const totalAmount = newVal.DATA.reduce((acc, item) => {
                    return acc + parseFloat(item.total_amount);
                }, 0);
                this.sales = totalAmount
            }
        },
        getExistingCashFlowData(newVal) {
            if (newVal.STATUS === 200) {
                this.data.register.opening_amount = newVal.DATA[0].opening_amount
            }
        },
        mode(newVal) {
            if (newVal === 'out') {
                this.user.timeOut = moment().format('YYYY-MM-DD HH:mm:ss')
            }
        }
    },
    methods: {
        ...mapActions(['registerCashFlow', 'logout', 'getCsrfToken']),
        assignDiscrepancyColor(color) {
            this.discrepancyColor = color
        },
        formatTimeCard(time) {
            return moment(time).utcOffset('+0800').format("MMMM D, YYYY h:mm:ss a");
        },
        formatAmount(total) {
            return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // With cents
        },
        saveData(key, qty, currency) {
            if (Object.prototype.hasOwnProperty.call(this.data.deno, key)) {
                this.data.deno[key] = qty;
                this.getTotal(currency)
            }
        },
        getTotal(currency) {
            this.total[currency] = 0
            for (const key of Object.keys(this.denoValues)) {
                if (key.startsWith(currency)) {
                    this.total[currency] += (this.data.deno[key] || 0) * this.denoValues[key];
                }
            }
        },
        async submitCashRegister() {
            if (this.$refs.form.validate()) {
                this.data.deno.register_cash_flow_id = window.$cookies.get('cash_register_recorded_id')
                if (this.mode === 'in') {
                    this.data.register.opening_amount = Number(this.totalAmount)
                    this.data.deno.isTimeIn = 1
                }
                if (this.mode === 'out') {
                    this.data.register.discrepancy = Number(this.discrepancy)
                    this.data.deno.isTimeIn = 0
                    this.data.register.closing_amount = Number(this.totalAmount)
                }
                this.registerCashFlow(this.data)
            }
        },

    },
    async mounted() {
        await this.getCsrfToken()
        this.user.name = window.$cookies.get('name')
        const timeIn = decodeURI(window.$cookies.get('timeIn'));
        this.data.deno.isTimeIn = timeIn
        this.user.timeIn = timeIn
    }
}
</script>

<style scoped>
.moneyQtySlot {
    width: 90px;
}
.moneyQtySlot::after {
    content: "";
    display: inline-block;
}
</style>

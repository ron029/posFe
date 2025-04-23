<template>
    <v-dialog
        v-model="showDialog"
        width="600"
    >
        <v-card>
            <h1>summary</h1>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data: ()=>({
        printStatus: false,
    }),
    props: ['show'],
    computed: {
        ...mapGetters(['fetchCashFlowSummaryData']),
        showDialog: {
            get() {
                if (this.show) this.cashFlowFunc()
                return this.show
            },
            set() {
                this.$emit('closeDialog')
            }
        }
    },
    watch: {
        fetchCashFlowSummaryData(newVal) {
            console.log('fetchCashFlowSummaryData newVal: ', newVal)
        },
        show(newVal) {
            if (newVal) {
                console.log('load files to print')
            }
        }
    },
    methods: {
        ...mapActions(['fetchCashFlowSummary']),
        cashFlowFunc() {
            const register_cash_flow_id = window.$cookies.get('cash_register_recorded_id')
            this.fetchCashFlowSummary({register_cash_flow_id})
        }
    },
}
</script>

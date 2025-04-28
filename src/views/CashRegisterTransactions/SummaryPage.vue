<template>
    <v-dialog
        v-model="showDialog"
        width="600"
    >
        <v-card
            :loading="loading"
        >
            <div v-if="!pdfUrl" ref="pdfContent" id="summary-content">
                <h2>===========================================</h2>
                <h4>&nbsp;&nbsp;&nbsp;{{ dateToday }}</h4>
                <ul>
                    <li>Name: <b> {{ summaryData.cashier }} </b></li>
                    <li>Time of shift:<b> {{ formatDate(summaryData.time_in) }} to <br> {{ formatDate(summaryData.time_out) }} </b></li>
                    <li>Total work hours: <b> {{ totalWorkHours }} </b></li>
                    <li>Money in: <b>Php {{ summaryData.opening_amount }} </b></li>
                    <li>Money out: <b>Php {{ summaryData.closing_amount }} </b></li>
                    <li>Discrepancy: <b>Php {{ summaryData.discrepancy < 0 ? Number(Math.abs(summaryData.discrepancy)).toFixed(2) : summaryData.discrepancy }} <br> ({{ summaryData.discrepancy > 0 ? 'shortage' : 'overage'}}) </b></li>
                    <li>Total cost: <b>Php {{ totalCost.toFixed(2) }} </b></li>
                    <li>Total profit: <b>Php {{ totalProfit.toFixed(2) }} </b></li>
                    <li>Total sales: <b>Php {{ totalSales.toFixed(2) }} </b></li>
                    <li>Total orders: <b> {{ summaryData.salesDetails.length }} </b></li>
                </ul>
                <h2>===========================================</h2>
            </div>
            <iframe v-else :src="pdfUrl" style="width:100%; height:500px;" />
        </v-card>
    </v-dialog>
</template>

<script>
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';

export default {
    data: ()=>({
        pdfUrl: null,
        printStatus: false,
        loading: false,
        summaryData: {
            cashier: null,
            closing_amount: 0,
            discrepancy: 0,
            opening_amount: 0,
            register_cash_flow_id: null,
            salesDetails: [],
            time_in: moment,
            time_out: moment,
        }
    }),
    props: ['show'],
    computed: {
        ...mapGetters(['fetchCashFlowSummaryData']),
        totalCost() {
            console.log('this.summaryData.salesDetails.length: ', this.summaryData.salesDetails.length)
            if (this.summaryData.salesDetails.length > 0) {
                const total = this.summaryData.salesDetails.reduce((sum, item) => {
                    return sum + (parseFloat(item.cost_price) * Number(item.quantity));
                }, 0);
                return total; // optional formatting to "90.00"
            } else {
                return 0;
            }
        },
        totalProfit() {
            if (this.summaryData.salesDetails.length > 0) {
                const total = this.summaryData.salesDetails.reduce((sum, item) => {
                    return sum + ((parseFloat(item.selling_price) - parseFloat(item.cost_price)) * Number(item.quantity))
                }, 0);
                return total;
            } else {
                return 0;
            }
        },
        totalSales() {
            if (this.summaryData.salesDetails.length > 0) {
                const total =  this.summaryData.salesDetails.reduce((sum, item) => {
                    return sum + Number(item.subtotal)
                }, 0);
                return total;
            } else {
                return 0;
            }
        },
        totalWorkHours() {
            if (this.summaryData.time_in && this.summaryData.time_out) {
                const start = moment(this.summaryData.time_in);
                const end = moment(this.summaryData.time_out);
                const duration = moment.duration(end.diff(start));
                const hours = duration.asHours();
                return hours.toFixed(2); // e.g. "7.50" hours
            }
            return '0.00';
        },
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.pdfUrl = null
                this.$emit('closeDialog')
            }
        },
        dateToday() {
            return this.formatDate(moment())
        }
    },
    watch: {
        summaryData() {
            setTimeout(async ()=>{
                this.loading = false
                await this.downloadPDF()
            })
        },
        fetchCashFlowSummaryData(newVal) {
            if (newVal && newVal.STATUS === 200) {
                this.summaryData = newVal.DATA
            }
            console.log('fetchCashFlowSummaryData newVal: ', newVal)
        },
        show(newVal) {
            if (newVal) {
                console.log('cashFlowFunc')
                this.cashFlowFunc()
            }
        }
    },
    methods: {
        ...mapActions(['fetchCashFlowSummary']),
        async downloadPDF() {
            const element = this.$refs.pdfContent;

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = 165; // 58mm paper in pt
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: [pdfWidth, pdfHeight],
            });

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            setTimeout(()=>{
                // Generate Blob and create preview URL
                const blob = pdf.output('blob');
                this.pdfUrl = URL.createObjectURL(blob);
            }, 1000)
        },
        formatDate(date) {
            return moment(date).format('MMMM D, YYYY HH:mm')
        },
        cashFlowFunc() {
            this.loading = true
            const register_cash_flow_id = window.$cookies.get('cash_register_recorded_id')
            this.fetchCashFlowSummary({register_cash_flow_id})
        }
    },
}
</script>

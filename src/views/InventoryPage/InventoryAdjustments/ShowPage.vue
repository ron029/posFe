<template>
    <v-dialog
        v-model="showDialog"
    >
        <v-card>
            <v-card-title>
                <v-chip>{{ current_item.reference_number }}</v-chip>&nbsp;-&nbsp;{{ current_item.created_by }}&nbsp;-&nbsp;{{ formatDate(current_item.created_at) }}
            </v-card-title>
            <v-card-text>
                <v-data-table
                    :items="inventoryAdjustmentsFindData && inventoryAdjustmentsFindData.DATA"
                    :headers="headers"
                ></v-data-table>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
    data: () => ({
        headers: [
            // {text: 'Reference Number', value: 'reference_number'},
            // {text: 'Created By', value: 'employee'},
            {text: 'Brand', value: 'brand'},
            {text: 'Category', value: 'category'},
            {text: 'Name', value: 'product'},
            {text: 'Cost P.', value: 'cost_price'},
            {text: 'Selling P.', value: 'selling_price'},
            {text: 'Incoming Q.', value: 'incoming_quantity'},
            {text: 'Adjustment Q.', value: 'adjustment_quantity'},
            {text: 'Remarks', value: 'item_remarks'},
            // {text: 'Created At', value: 'created_at'},
        ],
        adjusmentItems: [],
    }),
    props: ['show', 'current_item'],
    computed: {
        ...mapGetters(['inventoryAdjustmentsFindData', 'inventoryAdjustmentsGetData']),
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.$emit('closeDialog')
            }
        }
    },
    methods: {
        formatDate(date) {
            return moment(date).format('MMMM D, YYYY h:mm:ss A')
        },
    }
}
</script>

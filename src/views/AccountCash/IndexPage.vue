<template>
    <div style="margin: 0 20px">
        <h1>Account Cash</h1>
        <v-card>
            <v-card-text>
                <v-data-table
                    :items="items"
                    :headers="headers"
                >
                    <template slot="item.created_at" slot-scope="{ item }">
                        {{ formatDate(item.created_at) }}
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex'

export default {
    data: ()=>({
        items: [],
        headers: [
            { text: 'Name', value: 'name' },
            { text: 'Opening Amount', value: 'opening_amount' },
            { text: 'Closing Amount', value: 'closing_amount' },
            { text: 'Discrepancy', value: 'discrepancy' },
            { text: 'Date', value: 'created_at' },
        ]
    }),
    computed: {
        ...mapGetters(['allCashFlowData'])
    },
    watch: {
        allCashFlowData(newVal) {
            if (newVal.STATUS === 200) {
                this.items = newVal.DATA
            } else {
                console.error(newVal.STATE)
            }
        }
    },
    methods: {
        ...mapActions(['allCashFlow']),
        formatDate(date) {
            return moment(date).utcOffset('+0800').format('MMMM D, YYYY HH:mm:ss')
        }
    },
    mounted() {
        this.allCashFlow()
    }
}
</script>

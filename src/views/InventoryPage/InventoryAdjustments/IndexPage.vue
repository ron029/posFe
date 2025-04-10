<template>
    <v-dialog v-model="showDialog">
        <v-card>
            <v-card-text style="padding: 20px">
                <v-card>
                    <v-data-table
                        :headers="headers"
                        :items="items"
                    >
                        <template v-slot:top>
                            <p class="text-right" style="padding: 10px 10px 0 10px;">
                                <v-btn
                                    small
                                    color="success"
                                    @click="showNewInventoryAdjusment = true"
                                ><v-icon>mdi-plus</v-icon>&nbsp;add inventory adjustment</v-btn>
                            </p>
                        </template>
                        <template slot="item.created_at" slot-scope="{ item }">
                            {{ formatDate(item.created_at) }}
                        </template>
                        <template slot="item.actions" slot-scope="{ item }">
                            <v-btn
                                icon
                                color="primary"
                                @click="handleShowInventoryAdjusments(item)"
                            ><v-icon>mdi-eye</v-icon></v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-card-text>
        </v-card>
        <ShowPage
            :show="showFindInventoryAdjusment"
            :current_item="current_item"
            @closeDialog="showFindInventoryAdjusment = false"
        />
        <NewPage
            :show="showNewInventoryAdjusment"
            @closeDialog="showNewInventoryAdjusment = false"
        />
    </v-dialog>
</template>

<script>
import ShowPage from './ShowPage.vue';
import { mapActions, mapGetters } from 'vuex';
import NewPage from './NewPage.vue';
import moment from 'moment';
export default {
    components: {
        NewPage, ShowPage
    },
    data: ()=>({
        showFindInventoryAdjusment: false,
        showNewInventoryAdjusment: false,
        items: [],
        current_item: {
            reference_number: null,
            created_by: null,
            created_at: null
        },
        headers: [
            {text: "Reference Number", value: "reference_number"},
            {text: "Created By", value: 'created_by'},
            {text: "Total Products", value: 'total_product'},
            {text: "Incoming Quantity", value: 'incoming_quantity'},
            {text: 'Adjustment Quantity', value: 'adjustment_quantity'},
            {text: 'Timestamp', value: 'created_at'},
            {text: 'Remarks', value: 'remarks'},
            {text: 'Actions', value: 'actions'}
        ]
    }),
    props: ['show'],
    computed: {
        ...mapGetters(['inventoryAdjustmentsGetData', 'inventoryAdjustmentsFindData']),
        showDialog: {
            get() {
                return this.show
            },
            set() {
                return this.$emit('closeDialog')
            }
        }
    },
    watch: {
        inventoryAdjustmentsFindData(newVal) {
            if (newVal.STATUS === 200) {
                this.showFindInventoryAdjusment = true
            }
        },
        inventoryAdjustmentsGetData(newVal) {
            if (newVal.STATUS === 200) {
                this.items = newVal.DATA
            }
        }
    },
    methods: {
        ...mapActions(['inventoryAdjustmentsGet', 'inventoryAdjustmentsFind']),
        formatDate(date) {
            return moment(date).format('MMMM D, YYYY h:mm:ss A')
        },
        handleShowInventoryAdjusments(item) {
            this.current_item = item
            this.inventoryAdjustmentsFind({referenceNum: item.reference_number})
        }
    },
    mounted() {
        this.inventoryAdjustmentsGet()
    }
}
</script>

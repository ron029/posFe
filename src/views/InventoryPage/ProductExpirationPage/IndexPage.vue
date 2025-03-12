<template>
    <v-dialog
        v-model="showDialog"
        width="100%"
    >
        <v-card>
            <v-card-title>PRODUCT EXPIRATION PAGE&nbsp;

                <v-card style="width: 550px; padding: 10px">
                    <div style="width: 170px; display: inline-block; margin-right: 10px;">
                        <v-select
                            outlined
                            hide-details
                            dense
                            item-text="name"
                            item-value="value"
                            v-model="filter.val"
                            :items="filter.items"
                            label="Filter by status"
                            item-key="name"
                        ></v-select>
                    </div>
                    <v-text-field
                        style="display: inline-block;"
                        v-model="filter.date.start"
                        label="Start Date"
                        type="date"
                        outlined
                        dense
                        hide-details
                    ></v-text-field> ~
                    <v-text-field
                        style="display: inline-block;"
                        v-model="filter.date.end"
                        label="End Date"
                        type="date"
                        outlined
                        dense
                        hide-details
                    ></v-text-field>
                </v-card>
                <v-spacer></v-spacer>
                <v-btn v-if="selected.length > 0" @click="handleShowMultipleEdit">Edit</v-btn>
                <v-btn @click="view.create = true">New</v-btn>
            </v-card-title>
            <v-card-text>
                <v-card>
                    <v-data-table
                        :items="displayProductExpiryFilterByStatus"
                        :headers="headers"
                        return-object
                        dense
                        v-model="selected"
                        :single-select="false"
                        :show-select="true"
                        item-key="product_expiration_id"
                    >
                        <template v-slot:item.name="{ item }">
                            {{ item.brand }} {{ item.name }} {{ item.unit }}
                        </template>
                        <template v-slot:item.notif_date="{ item }">
                            {{ formatDate(item.notif_date) }}
                        </template>
                        <template v-slot:item.expiration_date="{ item }">
                            {{ formatDate(item.expiration_date) }}
                        </template>
                        <template v-slot:item.muted="{ item }">
                            <v-icon :color="item.muted === 0 ? 'green' : 'red'">{{ item.muted === 0 ? 'mdi-bell-ring' : 'mdi-bell-off' }}</v-icon>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-btn icon color="orange"><v-icon>mdi-pencil</v-icon></v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-card-text>
        </v-card>
        <CreatePage
            v-if="view.create"
            :show="view.create"
            @closeDialog="view.create = false"
        ></CreatePage>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CreatePage from './CreatePage.vue';
import moment from 'moment';

export default {
    components: {
        CreatePage
    },
    data: ()=>({
        selected: [],
        filter: {
            date: {
                start: moment().format('YYYY-MM-DD'),
                end: moment().format('YYYY-MM-DD'),
            },
            val: 1,
            items: [
                {name: 'All', value: null},
                {name: 'Unmuted', value: 1},
                {name: 'Muted', value: 0},
            ]
        },
        headers: [
            { text: '', value: 'data-table-select' },
            { text: 'Name', value: 'name' },
            { text: 'Notif Date', value: 'notif_date' },
            { text: 'Expiration Date', value: 'expiration_date' },
            { text: 'Days Remaining', value: 'days_remaining' },
            { text: 'Status', value: 'muted' },
            { text: 'Comments', value: 'comments' },
            { text: 'Actions', value: 'actions' }
        ],
        view: {
            create: false,
            edit: false,
        }
    }),
    props: ['show'],
    computed: {
        ...mapGetters(['productExpirationData']),
        displayProductExpiryFilterByStatus() {
            if (this.productExpirationData && this.productExpirationData.DATA) {
                let data = this.productExpirationData.DATA
                data = data
                .filter(item =>
                    // Check if notification date is within range
                    (moment(item.notif_date).utcOffset('+0800').isSameOrAfter(this.filter.date.start) &&
                    moment(item.notif_date).utcOffset('+0800').isSameOrBefore(this.filter.date.end))
                    ||
                    // OR check if expiration date is within range
                    (moment(item.expiration_date).utcOffset('+0800').isSameOrAfter(this.filter.date.start) &&
                    moment(item.expiration_date).utcOffset('+0800').isSameOrBefore(this.filter.date.end))
                    ||
                    // OR check if date range is completely within notification and expiration period
                    (moment(item.notif_date).utcOffset('+0800').isSameOrBefore(this.filter.date.start) &&
                    moment(item.expiration_date).utcOffset('+0800').isSameOrAfter(this.filter.date.end))
                )
                .map(item => ({
                    ...item,
                    days_remaining: this.daysRemaining(item.expiration_date)
                }));
                if (this.filter.val === null) return data
                else return data.filter(item => item.muted !== this.filter.val)
            } else {
                return []
            }

        },
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
        productExpirationData(newVal) {
            console.log('watch productExpirationData newVal: ', newVal)
        }
    },
    methods: {
        ...mapActions(['productExpiration']),
        handleShowMultipleEdit() {
            this.view.edit = true
        },
        daysRemaining(endDate) {
            return moment(endDate).diff(moment(), 'days')
        },
        formatDate(date) {
            return moment(date).utcOffset('+0800').format('MMMM D, YYYY')
        }
    },
    created() {
        this.productExpiration()
    }
}
</script>

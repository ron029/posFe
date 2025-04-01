<template>
    <v-dialog
        v-model="showDialog"
        width="100%"
    >
        <v-card>
            <v-card-title>
                <v-card style="width: 570px; padding: 10px">
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
                    <v-form
                        v-model="valid"
                        style="width: fit-content; display: inline-block;"
                    >
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
                            :rules="[v=>!!v||'Notif date is required'].concat(notifRule(filter.date.start, filter.date.end))"
                        ></v-text-field>
                    </v-form>
                </v-card>
                <v-spacer></v-spacer>
                <v-btn v-if="selected.length > 0" @click="handleShowMultipleEdit" :disabled="!isUserCanUpdateProductExpire">{{selected.length > 1 ? 'bulk edit' : 'edit'}}</v-btn>
                <v-btn @click="view.create = true" :disabled="!isUserCanCreateProductExpire">New</v-btn>
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
                        <template slot="item.name" slot-scope="{ item }">
                            {{ item.brand }} {{ item.name }} {{ item.unit }}
                        </template>
                        <template slot="item.notif_date" slot-scope="{ item }">
                            {{ formatDate(item.notif_date) }}
                        </template>
                        <template slot="item.expiration_date" slot-scope="{ item }">
                            {{ formatDate(item.expiration_date) }}
                        </template>
                        <template slot="item.muted" slot-scope="{ item }">
                            <v-icon :color="item.muted === 0 ? 'green' : 'red'">{{ item.muted === 0 ? 'mdi-bell-ring' : 'mdi-bell-off' }}</v-icon>
                            &nbsp;<span>{{ item.muted === 0 ? 'Active' : 'Inactive' }}</span>
                        </template>
                        <template slot="item.actions" slot-scope="{ item }">
                            <v-btn
                                icon
                                color="orange"
                                style="display: inline-block;"
                                @click="editOne(item)"
                                :disabled="!isUserCanUpdateProductExpire"
                            ><v-icon>mdi-pencil</v-icon></v-btn>
                            <v-btn
                                icon
                                :color="item.muted === 0 ? 'red' : 'green'"
                                style="display: inline-block;"
                                @click="muteUnmuteProductExpiration(item, item.muted === 0 ? 1 : 0)"
                                :disabled="!isUserCanUpdateProductExpire"
                            ><v-icon>{{ item.muted === 0 ? 'mdi-bell-off' : 'mdi-bell-ring' }}</v-icon></v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-card-text>
        </v-card>
        <EditPage
            v-if="view.edit"
            :show="view.edit"
            :expiryData="selected"
            @closeDialog="closeDialog('edit')"
        />
        <CreatePage
            v-if="view.create"
            :show="view.create"
            @closeDialog="closeDialog('create')"
        ></CreatePage>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CreatePage from './CreatePage.vue';
import EditPage from './EditPage.vue';
import moment from 'moment';

export default {
    components: {
        CreatePage, EditPage
    },
    data: ()=>({
        valid: true,
        selected: [],
        filter: {
            date: {
                start: moment().format('YYYY-MM-DD'),
                end: moment().format('YYYY-MM-DD'),
            },
            val: 1,
            items: [
                {name: 'All', value: null},
                {name: 'Active', value: 1},
                {name: 'Inactive', value: 0},
            ]
        },
        headers: [
            { text: '', value: 'data-table-select' },
            { text: 'Name', value: 'name' },
            { text: 'Notif Date', value: 'notif_date' },
            { text: 'Expiration Date', value: 'expiration_date' },
            { text: 'Days Remaining', value: 'days_remaining' },
            { text: 'Status', value: 'muted' },
            { text: 'Comments', value: 'comment' },
            { text: 'Actions', value: 'actions' }
        ],
        view: {
            create: false,
            edit: false,
        }
    }),
    props: ['show'],
    computed: {
        ...mapGetters(['productExpirationData', 'productExpirationPutData', 'findUserRolePermissionData']),
        isUserCanReadProductExpire() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'product_exp:1')
            return false
        },
        isUserCanCreateProductExpire() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'product_exp:0')
            return false
        },
        isUserCanUpdateProductExpire() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'product_exp:2')
            return false
        },
        displayProductExpiryFilterByStatus() {
            if (this.valid && this.productExpirationData && this.productExpirationData.DATA) {
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
        productExpirationPutData(newVal) {
            if (newVal.STATUS === 200) {
                this.productExpiration()
            } else {
                console.error(newVal.STATE)
            }
        },
    },
    methods: {
        ...mapActions(['productExpiration', 'productExpirationPut']),
        closeDialog(action) {
            this.view[action] = false
            this.selected = []
        },
        editOne(item) {
            this.selected.push(structuredClone(item))
            delete this.selected.name
            delete this.selected.brand
            delete this.selected.unit
            delete this.selected.days_remaining
            this.view.edit = true
        },
        muteUnmuteProductExpiration(item, status) {
            const data = structuredClone(item)
            delete data.name
            delete data.brand
            delete data.unit
            delete data.days_remaining
            data.muted = status
            data.notif_date = moment(data.notif_date).format('YYYY-MM-DD')
            data.expiration_date = moment(data.expiration_date).format('YYYY-MM-DD')
            this.productExpirationPut(data)
        },
        notifRule(notif_date, expDate) {
            return [moment(notif_date).utcOffset('+0800').isSameOrBefore(moment(expDate).utcOffset('+0800')) || 'End Date should not after Start Date']
        },
        handleShowMultipleEdit() {
            this.view.edit = true
        },
        daysRemaining(endDate) {
            return moment(endDate).utcOffset('+0800').startOf('day').diff(moment(), 'days')
        },
        formatDate(date) {
            return moment(date).utcOffset('+0800').format('MMMM D, YYYY')
        }
    },
    created() {
        if (this.isUserCanReadProductExpire)
            this.productExpiration()
    }
}
</script>

<template>
    <v-data-table
        v-if="show"
        :headers="headers"
        :items="items"
    >
        <template slot="item.birthdate" slot-scope="{ item }">
            {{ formatDate(item.birthdate) }}
        </template>
        <template slot="item.is_active" slot-scope="{ item }">
            <span v-if="item.is_active === 1" style="display: inline-block; width: 70px;"><v-icon color="green">mdi-checkbox-marked</v-icon> Active</span>
            <span v-else style="display: inline-block; width: 80px;"><v-icon color="red">mdi-close-box</v-icon> Inactive</span>
        </template>
        <template slot="item.actions" slot-scope="{ item }">
            <span style="text-wrap: nowrap;">
                <v-btn icon color="warning"
                    @click="$emit('editAccount', item.employee_id)"
                    :disabled="!isUserCanUpdateEmployee"
                ><v-icon>mdi-pencil</v-icon></v-btn>
            </span>
            <span style="text-wrap: nowrap;">
                <v-btn icon color="info"
                    disabled
                    @click="test"
                ><v-icon>mdi-lock-reset</v-icon></v-btn>
            </span>
        </template>
        <template slot="item.role" slot-scope="{ item }">
            {{ getRoleName(item.role_id) }}
        </template>
    </v-data-table>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
export default {
    props: ['show', 'headers', 'items'],
    computed: {
        ...mapGetters(['userRoleData', 'findUserRolePermissionData']),
        isUserCanUpdateEmployee() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'employee:2')
            return false
        },
    },
    methods: {
        test() {

        },
        formatDate(date) {
            if (date === null) return ''
            return moment(date).utcOffset('+0800').format('MMMM D, YYYY')
        },
        getRoleName(role_id) {
            if (this.userRoleData && this.userRoleData.DATA) {
                const role = this.userRoleData.DATA.find(r => r.role_id === role_id);
                return role ? role.name : '';
            }
        }
    }
}
</script>

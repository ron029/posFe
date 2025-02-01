<template>
    <v-data-table
        v-if="show"
        :headers="headers"
        :items="items"
    >
        <template slot="item.birthdate" slot-scope="{ item }">
            {{ formatDate(item.birthdate) }}
        </template>
        <template slot="item.actions" slot-scope="{ item }">
            <span style="text-wrap: nowrap;">
                <v-btn icon color="warning" @click="$emit('editAccount', item.employee_id)"><v-icon>mdi-pencil</v-icon></v-btn>
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
        ...mapGetters(['userRoleData'])
    },
    methods: {
        formatDate(date) {
            if (date === null) return ''
            return moment(date).format('MMMM D, YYYY')
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

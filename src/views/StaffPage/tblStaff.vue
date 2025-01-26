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
    </v-data-table>
</template>

<script>
import moment from 'moment';
export default {
    props: ['show', 'headers', 'items'],
    methods: {
        formatDate(date) {
            if (date === null) return ''
            return moment(date).format('MMMM D, YYYY')
        },
    }
}
</script>

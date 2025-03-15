<template>
    <v-dialog
        v-model="showDialog"
        width="900px"
    >
        <v-card>
            <v-card-title>PRODUCT EXPIRATION PAGE <v-spacer></v-spacer><v-btn disabled @click="view.create = true">New</v-btn></v-card-title>
            <v-card-text>
                <v-data-table
                    :items="[]"
                    :headers="headers"
                ></v-data-table>
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
import CreatePage from './CreatePage.vue';

export default {
    components: {
        CreatePage
    },
    data: ()=>({
        headers: [
            { text: 'Name', value: 'name' },
            { text: 'Notif Date', value: 'date' },
            { text: 'Expiration Date', value: 'exp_date' },
            { text: 'Days Remaining', value: 'days_remaining' },
            { text: 'Actions', value: 'actions' }
        ],
        view: {
            create: false,
        }
    }),
    props: ['show'],
    computed: {
        showDialog: {
            get() {
                console.log('showComputed show: ', this.show)
                return this.show
            },
            set() {
                return this.$emit('closeDialog')
            }
        }
    }
}
</script>
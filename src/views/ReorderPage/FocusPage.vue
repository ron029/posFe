<template>
    <v-dialog
        v-model="showDialog"
        width="600"
    >
        <v-card>
            <v-card-title style="background-color: blue; color: white;">&nbsp;</v-card-title>
            <v-card-text style="padding-top: 20px;">
                <p>You are about to <strong>enable reorder notification</strong> for the following products:</p>
                <v-data-table
                    :items="data"
                    :headers="headers"
                ></v-data-table>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="showDialog=false">cancel</v-btn>
                <v-btn color="success" @click="$emit('enableNotification', items)">submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data: ()=>({
        items: [],
        headers: [
            { text: 'Description', value: 'name'},
            { text: 'Quantity', value: 'quantity'},
            { text: 'Reorder Level', value: 'reorder_level'}
        ]
    }),
    props: ['show', 'data'],
    computed: {
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.$emit('closeDialog')
            }
        }
    },
    watch: {
        show(newVal) {
            if (newVal) {
                this.items = []
                this.items = this.data.map(item => ({
                    entity_id: item.product_id,
                    entity_type: 'product',
                }))
            }
        }
    }
}
</script>

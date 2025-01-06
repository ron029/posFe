<template>
    <v-dialog
        v-model="showDialog"
        width="600"
    >
        <v-card>
            <v-card-title style="background-color: blue; color: white;">Ignore Page</v-card-title>
            <v-card-text style="padding-top: 20px;">
                <p>Please give a reason why you need to ignore notification in product below:</p>
                <div v-for="(item, index) in items" :key="index">
                    <v-textarea
                        auto-grow
                        outlined
                        :label="item.name"
                        rows="2"
                        row-height="20"
                        v-model="item.reason"
                        clearable
                    ></v-textarea>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="showDialog=false">cancel</v-btn>
                <v-btn color="success" @click="$emit('ignoreProduct', items)">submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data: ()=>({
        items: [],
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
                this.items = this.data.map(item => ({
                    entity_id: item.product_id,
                    changes_by: parseInt(window.$cookies.get('userId')),
                    reason: null,
                    changes_type: 'ignore',
                    entity_type: 'product',
                    name: item.name,
                }))
            }
        }
    }
}
</script>

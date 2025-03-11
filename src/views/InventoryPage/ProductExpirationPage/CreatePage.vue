<template>
    <v-dialog
        v-model="showDialog"
        width="600px"
    >
        <v-card>
            <v-card-title>New Product Expiration</v-card-title>
            <v-form
                v-model="valid"
                ref="form"
                @submit.prevent="submitForm"
            >
                <v-card-text>
                    
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn style="color: white; background-color: red;" @click="showDialog = false">Close</v-btn>
                    <v-btn type="submit" style="color: white; background-color: green;">Submit</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>    
    </v-dialog>
</template>

<script>
export default {
    data: ()=>({
        valid: false,
    }),
    props: ['show'],
    computed: {
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.$emit('closeDialog')
            }
        }
    }
}
</script>
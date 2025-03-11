<template>
    <v-dialog
        v-model="showDialog"
        width="900px"
    >
        <v-card>
            <v-card-title>New Product Expiration</v-card-title>
            <v-form
                v-model="valid"
                ref="form"
                @submit.prevent="submitForm"
            >
                <v-card-text>
                    <div style="margin: 0 auto; width: 680px;">
                        <div style="width: 250px; display: inline-block; margin-right: 10px;">
                            <v-combobox
                                dense
                                outlined
                                label="Product Name"
                                :rules="[v=>!!v||'Product name is required']"
                            ></v-combobox>
                        </div>
                        <div style="width: 200px; display: inline-block; margin-right: 10px;">
                            <v-text-field
                                dense
                                outlined
                                type="date"
                                label="Exp Date"
                                :rules="[v=>!!v||'Exp date is required']"
                            ></v-text-field>
                        </div>
                        <div style="width: 200px; display: inline-block; margin-right: 10px;">
                            <v-checkbox
                                dense
                                single-line
                                hide-details
                                label="Same as Exp Date"
                                style="display: inline-block;"
                            ></v-checkbox>
                            <v-text-field
                                outlined
                                dense
                                type="date"
                                label="Notif Date"
                                :rules="[v=>!!v||'Notif date is required']"
                            ></v-text-field>
                        </div>
                    </div>
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
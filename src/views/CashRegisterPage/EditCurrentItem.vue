<template>
    <v-dialog
        v-model="editItem"
        width="500"
    >
        <v-card v-if="edit">
            <v-form
                ref="form"
                v-model="valid"
                @submit.prevent="submitForm"
            >
                <v-card-title style="background-color: blue; color: white">Edit item: {{ edit.name }}</v-card-title>
                <v-card-text style="padding-top: 20px;">
                    <v-text-field
                        :value="edit.name"
                        disabled
                        label="Product Name"
                    ></v-text-field>
                    <v-text-field
                        :placeholder="`Original quantity is ${currentTransaction.itemQuantity}`"
                        v-model="edit.quantity_placeholder"
                        :rules="[
                            v => !!v || 'Quantity is required',
                            v => !isNaN(v) || 'Quantity must be a number',
                            v => v >= 1 || 'Quantity must be greater than or equal to 1',
                            v => v <= currentTransaction.quantity || `Only ${currentTransaction.quantity} items left`
                        ]"
                        :persistent-hint="!isNewTransaction"
                        :hint="isNewTransaction ? '' : 'Type the final quantity after subtracting the returned items.'"
                        :label="!isNewTransaction ? 'Items Remaining (After Return)' : 'Quantity'"
                    ></v-text-field>
                    <v-text-field
                        :value="edit.unit"
                        disabled
                        label="Unit"
                    ></v-text-field>
                    <v-text-field
                        :disabled="!isUserCanEditPrice"
                        v-model="edit.selling_price_placeholder"
                        label="Selling Price"
                        :placeholder="`Original selling price is ${currentTransaction.selling_price}`"
                        :rules="[
                            v => !!v || 'Selling Price is required',
                            v => !isNaN(v) || 'Selling Price must be a number',
                            v => v > 0 || 'Selling Price must be greater than 0',
                        ]"
                    ></v-text-field>
                    <v-text-field
                        :value="amount"
                        disabled
                        label="Amount"
                    ></v-text-field>
                    <v-select
                        :items="adjustmentItems"
                        v-model="edit.adjustment_type"
                        label="Adjustment Type"
                        :rules="[v => !!v || 'Adjustment type is required']"
                        clearable
                    ></v-select>
                    <v-text-field
                        v-show="!isNewTransaction"
                        v-model="edit.reason"
                        label="Reason"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="editItem = false" color="error">Cancel</v-btn>
                    <v-btn type="submit" color="success" :disabled="!valid">update</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
export default {
    data: () => ({
        valid: true,
        edit: {
            quantity_placeholder: 0,
            selling_price_placeholder: 0,
            name: null,
            unit: null,
            itemQuantity: 0,
            adjustment_type: null,
        },
        adjustmentItems: ['REFUND', 'CANCEL', 'TEST']
    }),
    props: [ 'show', 'currentTransaction', 'isNewTransaction' ],
    computed: {
        ...mapGetters(['findUserRolePermissionData']),
        isUserCanEditPrice() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'price:update')
            return false
        },
        amount() {
            const quantity = Number(this.edit.quantity_placeholder ?? 0);
            const price = Number(this.edit.selling_price_placeholder ?? 0);

            if (isNaN(quantity) || isNaN(price)) return 0.00;

            return parseFloat((quantity * price).toFixed(2));
        },
        editItem: {
            get() {
                this.reassignEditable(this.currentTransaction)
                return this.show
            },
            set() {
                if (!this.valid) this.reassignEditable(this.currentTransaction)
                delete this.edit.quantity_placeholder
                delete this.edit.selling_price_placeholder
                this.$emit('closeEditCurrentItem', this.edit)
                this.$eventBus.$emit('isDialogOpen', { status: false })
            }
        },
    },
    watch: {
        currentTransaction: {
            handler(newTransaction) {
                if (newTransaction) {
                    this.reassignEditable(newTransaction)
                }
            },
            immediate: true // Trigger the watcher when the component is mounted
        }
    },
    methods: {
        test() {
            console.log('test')
        },
        reassignEditable(data) {
            this.edit = data
            const reason = this.edit.itemQuantity >= data.quantity ? 'FULL REFUND' : 'REFUND'
            Vue.set(this.edit, 'reason', reason);
            Vue.set(this.edit, 'adjustment_type', 'REFUND');
            Vue.set(this.edit, 'name', data.name);
            Vue.set(this.edit, 'unit', data.unit);
            Vue.set(this.edit, 'quantity_placeholder', data.itemQuantity);
            Vue.set(this.edit, 'selling_price_placeholder', data.selling_price);
        },
        submitForm() {
            console.log('SUBMIT ADJUSTMENT')
            if (this.$refs.form.validate()) {
                this.edit.amount = this.amount
                this.edit.itemQuantity = Number(this.edit.quantity_placeholder)
                this.edit.selling_price = Number(this.edit.selling_price_placeholder)
                this.editItem = false
            }
        },
    },
    mounted() {
         this.edit.adjustment_type = 'REFUND'
    }
}
</script>

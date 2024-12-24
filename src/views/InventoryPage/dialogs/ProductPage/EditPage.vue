<template>
    <v-dialog v-model="showDialog">
        <v-card>
            <v-card-title>Edit Product</v-card-title>
            <v-card-text>
                <v-form
                    ref="editProduct"
                    v-model="valid"
                    @submit.prevent="submitForm"
                >
                    <v-autocomplete
                        v-model="item.category_id"
                        :items="select.categories"
                        item-text="name"
                        item-value="category_id"
                        label="Category Name"
                        :rules="rule.category"
                    ></v-autocomplete>
                    <v-autocomplete
                        v-model="item.brand_id"
                        :items="select.brands"
                        item-text="name"
                        item-value="brand_id"
                        label="Brand Name"
                        :rules="rule.brand"
                    ></v-autocomplete>
                    <v-text-field
                        label="Product Name"
                        v-model.trim="item.name"
                        :rules="rule.name"
                    ></v-text-field>
                    <v-text-field
                        label="Barcode"
                        v-model.trim="item.barcode"
                        :rules="rule.barcode"
                    ></v-text-field>
                    <v-autocomplete
                        v-model="item.unit_id"
                        :items="select.units"
                        item-text="name"
                        item-value="unit_id"
                        label="Measurements"
                        :rules="rule.unit"
                    ></v-autocomplete>
                    <v-text-field
                        label="Quantity"
                        type="number"
                        v-model=item.quantity
                        :rules="rule.quantity"
                    ></v-text-field>
                    <v-text-field
                        label="Price"
                        v-model="item.price"
                        type="number"
                        step="0.01"
                        @input="validateDecimal"
                        :rules="rule.price"
                    ></v-text-field>
                    <v-text-field
                        label="Reorder Level"
                        v-model.trim="item.reorder_level"
                        type="number"
                        :rules="rule.reorder_level"
                    ></v-text-field>
                    <v-autocomplete
                        v-model="item.supplier_id"
                        :items="select.suppliers"
                        item-text="name"
                        item-value="supplier_id"
                        label="Supplier's Name"
                        :rules="rule.supplier"
                    ></v-autocomplete>
                    <v-btn
                        color="success"
                        type="submit"
                        :disabled="!valid"
                        :loading="loading"
                    >submit</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data: () => ({
        loading: false,
        select: {},
        valid: false,
        rule: {
            unit: [ v => !!v || 'Measurement is required' ] ,
            brand: [ v => !!v || 'Brand Name is required'],
            category: [ v => !!v || 'Category Name is required' ],
            barcode: [ () => true ],
            supplier: [ v => !!v || 'Supplier Name is required' ],
            name: [ v => v && !!v.trim() || 'Product Name is required' ],
            quantity: [ v => !!v || 'quantity is required' ],
            price: [ v => !!v || 'price is required' ],
            reorder_level: [ v => !!v || 'reorder_level is required' ],
        },
        item: {
            unit_id: null,
            brand_id: null,
            supplier_id: null,
            category_id: null,
            barcode: null,
            name: null,
            price: null,
            quantity: null,
            reorder_level: null,
        },
    }),
    props: ['data', 'show'],
    computed: {
        ...mapGetters(['productPutData']),
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.$emit('closeEditProduct')
            }
        }
    },
    watch: {
        productPutData(newVal) {
            this.loading = false
            this.$emit('closeEditProduct')
            if (newVal) this.products()
        },
    },
    methods: {
        ...mapActions(['productPut', 'products']),
        validateDecimal(value) {
            // Ensure the value is a valid decimal with at most 2 decimal places
            const validatedValue = value.match(/^\d*\.?\d{0,2}$/) ? value : this.item.price;
            this.item.price = validatedValue; // Update only if the value is valid
        },
        submitForm() {
            if (this.$refs.editProduct.validate()) {
                this.loading = true
                this.productPut(this.item)
            }
        }
    },
    mounted() {
        if (this.data) {
            this.select = this.data.select
            this.item = this.data.item
        }
    }
}
</script>

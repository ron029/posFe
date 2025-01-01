<template>
    <v-dialog
        v-model="showDialog"
        width="600px"
    >
        <v-card>
            <v-form
                ref="newProduct"
                v-model="valid"
                @submit.prevent="submitForm"
            >
                <v-card-title>New Product</v-card-title>
                <v-card-text>
                        <v-autocomplete
                            v-model.trim="item.category_id"
                            :items="select.categories"
                            item-text="name"
                            item-value="category_id"
                            label="Category Name"
                            :rules="rule.category"
                        ></v-autocomplete>
                        <v-autocomplete
                            v-model.trim="item.brand_id"
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
                            v-model.trim="item.unit_id"
                            :items="select.units"
                            item-text="name"
                            item-value="unit_id"
                            label="Measurements"
                            :rules="rule.unit"
                        ></v-autocomplete>
                        <v-text-field
                            label="Quantity"
                            type="number"
                            v-model.trim=item.quantity
                            :rules="rule.quantity"
                        ></v-text-field>
                        <v-text-field
                            label="Cost Price"
                            v-model.trim="item.cost_price"
                            type="number"
                            step="0.01"
                            @input="validateDecimalCost"
                            :rules="rule.cost_price"
                        ></v-text-field>
                        <v-text-field
                            label="Selling Price"
                            v-model.trim="item.selling_price"
                            type="number"
                            step="0.01"
                            @input="validateDecimalSelling"
                            :rules="rule.selling_price"
                        ></v-text-field>
                        <v-text-field
                            label="Reorder Level"
                            v-model.trim="item.reorder_level"
                            type="number"
                            :rules="rule.reorder_level"
                        ></v-text-field>
                        <v-autocomplete
                            v-model.trim="item.supplier_id"
                            :items="select.suppliers"
                            item-text="name"
                            item-value="supplier_id"
                            label="Supplier's Name"
                            :rules="rule.supplier"
                        ></v-autocomplete>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="success"
                            type="submit"
                            :disabled="!valid"
                            :loading="loading"
                            style="margin-right: 20px;"
                        >submit</v-btn>
                    </v-card-actions>
                </v-form>
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
            quantity: [ v => v && !!v.trim() || 'quantity is required' ],
            cost_price: [ v => !!v || 'Cost Price is required' ],
            selling_price: [ v => !!v || 'Selling Price is required' ],
            reorder_level: [ v => !!v || 'reorder_level is required' ],
        },
        item: {
            unit_id: null,
            brand_id: null,
            supplier_id: null,
            category_id: null,
            barcode: null,
            name: null,
            selling_price: null,
            cost_price: null,
            quantity: null,
            reorder_level: null,
        },
    }),
    props: ['data', 'show'],
    computed: {
        ...mapGetters(['productPostData']),
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.$emit('closeAddProduct')
            }
        }
    },
    watch: {
        async productPostData(newVal) {
            this.loading = false
            this.$emit('closeAddProduct')
            if (newVal) {
                await this.getCsrfToken()
                this.products()
            }
        },
        data: {
            handler(newVal) {
                this.select = newVal.select
            },
            deep: true
        }
    },
    methods: {
        ...mapActions(['productPost', 'products', 'getCsrfToken']),
        validateDecimalSelling(value) {
            // Ensure the value is a valid decimal with at most 2 decimal places
            const validatedValue = value.match(/^\d*\.?\d{0,2}$/) ? value : this.item.selling_price;
            this.item.selling_price = validatedValue; // Update only if the value is valid
        },
        validateDecimalCost(value) {
            // Ensure the value is a valid decimal with at most 2 decimal places
            const validatedValue = value.match(/^\d*\.?\d{0,2}$/) ? value : this.item.cost_price;
            this.item.cost_price = validatedValue; // Update only if the value is valid
        },
        async submitForm() {
            if (this.$refs.newProduct.validate()) {
                this.loading = true
                await this.getCsrfToken()
                this.productPost(this.item)
            }
        }
    },
    mounted() {
        if (this.data) this.select = this.data.select
    }
}
</script>

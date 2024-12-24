<template>
    <div style="width: 100%;">
        <h1 style="background-color: red;">Inventory Page</h1>
        <v-btn @click="showProductForm">Add Products</v-btn>
        <v-btn @click="show.unit = true">Measurement</v-btn>
        <v-btn @click="show.category = true">Categories</v-btn>
        <v-btn @click="show.brand = true">Brands</v-btn>
        <v-btn @click="show.supplier = true">Suppliers</v-btn>
        <v-expand-transition>
            <div v-if="show.product">
                <v-form
                    ref="newProduct"
                    v-model="valid"
                    @submit.prevent="submitForm()"
                >
                    <v-autocomplete
                        v-model.trim="item.category_id"
                        :items="select.categories"
                        item-text="name"
                        item-value="category_id"
                        label="Category Name"
                        :rules="rule.category"
                    ></v-autocomplete>
                    <v-autocomplete
                        v-model.trim="item.supplier_id"
                        :items="select.suppliers"
                        item-text="name"
                        item-value="supplier_id"
                        label="Supplier's Name"
                        :rules="rule.supplier"
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
                        label="Price"
                        v-model.trim="item.price"
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
                    <v-btn color="success" type="submit" :disabled="!valid">submit</v-btn>
                </v-form>
            </div>
        </v-expand-transition>
        <v-card>
            <v-data-table
                :headers="productHeaders"
                :items="productItems"
                dense
            ></v-data-table>
        </v-card>
        <showUnit
            :show="show.unit"
            @hideUnit="show.unit = false"
        />
        <showCategory
            :show="show.category"
            @hideCategory="show.category = false"
        />
        <showBrand
            :show="show.brand"
            @hideBrand="show.brand = false"
        />
        <showSupplier
            :show="show.supplier"
            @hideSupplier="show.supplier = false"
        />
    </div>
</template>

<script>
import showBrand from './dialogs/BrandPage.vue';
import showSupplier from './dialogs/SupplierPage.vue';
import showUnit from './dialogs/UnitPage.vue';
import showCategory from './dialogs/CategoryPage.vue';
import { mapActions, mapGetters } from 'vuex';
export default {
    components: {
        showBrand,
        showSupplier,
        showUnit,
        showCategory,
    },
    data: ()=>({
        show: {
            product: false,
            unit: false,
            category: false,
            brand: false,
            supplier: false,
        },
        valid: false,
        select: {
            brands: [],
            units: [],
            categories: [],
            suppliers: []
        },
        item: {
            unit_id: null,
            brand_id: null,
            supplier_id: null,
            category_id: null,
            name: null,
            price: null,
            quantity: null,
            reorder_level: null,
        },
        productHeaders: [
            { text: 'Name', value: 'name' },
            { text: 'Price', value: 'price' },
            { text: 'Quantity', value: 'quantity' },
            { text: 'Reorder Level', value: 'reorder_level' },
        ],
        productItems: [],
        rule: {
            unit: [ v => !!v || 'Measurement is required' ] ,
            brand: [ v => !!v || 'Brand Name is required'],
            category: [ v => !!v || 'Category Name is required' ],
            supplier: [ v => !!v || 'Supplier Name is required' ],
            name: [ v => v && !!v.trim() || 'Product Name is required' ],
            quantity: [ v => v && !!v.trim() || 'quantity is required' ],
            price: [ v => !!v || 'price is required' ],
            reorder_level: [ v => !!v || 'reorder_level is required' ],
        }
    }),
    computed: {
        ...mapGetters(['unitData', 'categoryData', 'brandData', 'supplierData', 'productData', 'productPostData'])
    },
    watch: {
        productPostData(newVal) {
            if (newVal) console.log('productPostData newVal: ', newVal)
        },
        productData(newVal) {
            this.productItems = newVal.DATA
        },
        unitData(newVal) {
            this.select.units = newVal.DATA
        },
        categoryData(newVal) {
            this.select.categories = newVal.DATA
        },
        brandData(newVal) {
            this.select.brands = newVal.DATA
        },
        supplierData(newVal) {
            this.select.suppliers = newVal.DATA
        }
    },
    methods: {
        ...mapActions(['getCsrfToken', 'units', 'categories', 'brands', 'suppliers', 'products', 'productPost']),
        showProductForm() {
            this.show.product = !this.show.product
        },
        validateDecimal(value) {
            // Ensure the value is a valid decimal with at most 2 decimal places
            const validatedValue = value.match(/^\d*\.?\d{0,2}$/) ? value : this.item.price;
            this.item.price = validatedValue; // Update only if the value is valid
        },
        submitForm() {
            if (this.$refs.newProduct.validate()) {
                console.log('form validate successufl')
                this.productPost(this.item)
            }
        }
    },
    async mounted() {
        await this.getCsrfToken()
        this.units()
        this.categories()
        this.brands()
        this.suppliers()
        this.products()
    }
}
</script>

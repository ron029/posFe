<template>
    <v-dialog
        v-model="showDialog"
        :width="productNum.status && productNum.value > 1 ? '100%' : '600px'"
    >
        <v-card>
            <div v-if="!productNum.custom&&!productNum.status">
                <v-card-title>New Product</v-card-title>
                <v-card-text>
                    <p>Add 1 product? <v-btn @click="addOneProduct">Yes</v-btn><v-btn @click="addCustomProduct">Custom</v-btn></p>
                </v-card-text>
            </div>
            <div v-if="productNum.custom">
                <v-card-title>New Product</v-card-title>
                <v-card-text>
                    <v-select
                        :items="[1, 5, 10, 15, 20]"
                        v-model="productNum.value"
                        label="How many products do you want to add?"
                        @click="handleClickProductNumValue"
                        @keydown="handleKeyDownProductNum"
                    ></v-select>
                </v-card-text>
            </div>
            <div v-else-if="productNum.status && productNum.value === 1">
                <v-form
                    ref="newProduct"
                    v-model="valid"
                    @submit.prevent="submitForm"
                >
                    <v-card-title>New Product <v-spacer></v-spacer><v-btn @click="handleSelectProductCount">back</v-btn></v-card-title>
                    <v-card-text>
                        <v-autocomplete
                            v-model.trim="item[0].category_id"
                            :items="select.categories"
                            item-text="name"
                            item-value="category_id"
                            label="Category Name"
                            :rules="rule.category"
                            :search-input.sync="add[0].category.value"
                        >
                            <template v-slot:no-data>
                                <span style="margin-left: 10px;">{{ add[0].category.value }} <v-btn :loading="loading.category" @click="handleAddCategory(add[0].category.value)">Add Category?</v-btn></span>
                            </template>
                        </v-autocomplete>
                        <v-autocomplete
                            v-model.trim="item[0].brand_id"
                            :items="select.brands"
                            item-text="name"
                            item-value="brand_id"
                            label="Brand Name"
                            :rules="rule.brand"
                            :search-input.sync="add[0].brand.value"
                        >
                            <template v-slot:no-data>
                                <span style="margin-left: 10px;">{{ add[0].brand.value }} <v-btn :loading="loading.brand" @click="handleAddBrand(add[0].brand.value)">Add Brand?</v-btn></span>
                            </template>
                        </v-autocomplete>
                        <v-autocomplete
                            v-model.trim="item[0].unit_id"
                            :items="select.units"
                            item-text="name"
                            item-value="unit_id"
                            label="Measurements"
                            :rules="rule.unit"
                            :search-input.sync="add[0].unit.value"
                        >
                            <template v-slot:no-data>
                                <span style="margin-left: 10px;">{{ add[0].unit.value }} <v-btn :loading="loading.unit" @click="handleAddUnit(add[0].unit.value)">Add Unit?</v-btn></span>
                            </template>
                        </v-autocomplete>
                        <v-text-field
                            label="Product Name"
                            v-model.trim="item[0].name"
                            :rules="rule.name"
                        ></v-text-field>
                        <v-text-field
                            label="Barcode"
                            v-model.trim="item[0].barcode"
                            :rules="rule.barcode"
                        ></v-text-field>
                        <v-text-field
                            label="Quantity"
                            type="number"
                            v-model.trim=item[0].quantity
                            :rules="rule.quantity"
                        ></v-text-field>
                        <v-text-field
                            label="Reorder Level"
                            v-model.trim="item[0].reorder_level"
                            type="number"
                            :rules="rule.reorder_level"
                        ></v-text-field>
                        <v-text-field
                            label="Cost Price"
                            v-model.trim="item[0].cost_price"
                            type="number"
                            step="0.01"
                            @input="validateDecimalCost"
                            :rules="rule.cost_price"
                        ></v-text-field>
                        <v-text-field
                            label="Selling Price"
                            v-model.trim="item[0].selling_price"
                            type="number"
                            step="0.01"
                            @input="validateDecimalSelling"
                            :rules="rule.selling_price"
                        ></v-text-field>
                        <v-autocomplete
                            v-model.trim="item[0].supplier_id"
                            :items="select.suppliers"
                            item-text="name"
                            item-value="supplier_id"
                            label="Supplier's Name"
                            :rules="rule.supplier"
                            :search-input.sync="add[0].supplier.value"
                        >
                            <template v-slot:no-data>
                                <span style="margin-left: 10px;">{{ add[0].supplier.value }} <v-btn :loading="loading.supplier" @click="handleAddSupplier(add[0].supplier.value)">Add Supplier?</v-btn></span>
                            </template>
                        </v-autocomplete>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="success"
                            type="submit"
                            :disabled="!valid"
                            :loading="loading.newProduct"
                            style="margin-right: 20px;"
                        >submit</v-btn>
                    </v-card-actions>
                </v-form>
            </div>
            <div v-else-if="productNum.status && productNum.value > 1">
                <v-form
                    ref="newProduct"
                    v-model="valid"
                    @submit.prevent="submitForm"
                >
                    <v-card-title>New Product <v-spacer></v-spacer><v-btn @click="handleSelectProductCount">back</v-btn></v-card-title>
                    <v-card-text>
                        <div v-for="(productItem, index) in item" :key="index" style="display: flex; width: 100%;">
                            <v-autocomplete
                                outlined
                                style="display: inline-block; width: 100px;"
                                v-model.trim="productItem.category_id"
                                :items="select.categories"
                                item-text="name"
                                item-value="category_id"
                                label="Category Name"
                                :rules="rule.category"
                                :search-input.sync="add[index].category.value"
                            >
                                <template v-slot:no-data>
                                    <span style="margin-left: 10px;">{{ add[index].category.value }} <v-btn :loading="loading.category" @click="handleAddCategory(add[index].category.value)">Add Category?</v-btn></span>
                                </template>
                            </v-autocomplete>
                            <v-autocomplete
                                outlined
                                style="display: inline-block; width: 100px;"
                                v-model.trim="productItem.brand_id"
                                :items="select.brands"
                                item-text="name"
                                item-value="brand_id"
                                label="Brand Name"
                                :rules="rule.brand"
                                :search-input.sync="add[index].brand.value"
                            >
                                <template v-slot:no-data>
                                    <span style="margin-left: 10px;">{{ add[index].brand.value }} <v-btn :loading="loading.brand" @click="handleAddBrand(add[index].brand.value)">Add Brand?</v-btn></span>
                                </template>
                            </v-autocomplete>
                            <v-autocomplete
                                outlined
                                style="display: inline-block; width: 100px;"
                                v-model.trim="productItem.unit_id"
                                :items="select.units"
                                item-text="name"
                                item-value="unit_id"
                                label="Measurements"
                                :rules="rule.unit"
                                :search-input.sync="add[index].unit.value"
                            >
                                <template v-slot:no-data>
                                    <span style="margin-left: 10px;">{{ add[index].unit.value }} <v-btn :loading="loading.unit" @click="handleAddUnit(add[index].unit.value)">Add Unit?</v-btn></span>
                                </template>
                            </v-autocomplete>
                            <v-text-field
                                outlined
                                style="display: inline-block; width: 100px;"
                                label="Product Name"
                                v-model.trim="productItem.name"
                                :rules="rule.name"
                            ></v-text-field>
                            <v-text-field
                                outlined
                                style="display: inline-block; width: 100px;"
                                label="Barcode"
                                v-model.trim="productItem.barcode"
                                @keydown.enter.prevent
                                @keyup.enter.prevent
                                :rules="rule.barcode"
                            ></v-text-field>
                            <v-text-field
                                outlined
                                style="display: inline-block; width: 30px;"
                                label="Quantity"
                                type="number"
                                v-model.trim=productItem.quantity
                                :rules="rule.quantity"
                            ></v-text-field>
                            <v-text-field
                                outlined
                                style="display: inline-block; width: 30px;"
                                label="Reorder Level"
                                v-model.trim="productItem.reorder_level"
                                type="number"
                                :rules="rule.reorder_level"
                            ></v-text-field>
                            <v-text-field
                                outlined
                                style="display: inline-block; width: 30px;"
                                label="Cost Price"
                                v-model.trim="productItem.cost_price"
                                type="number"
                                step="0.01"
                                @input="validateDecimalCost"
                                :rules="rule.cost_price"
                            ></v-text-field>
                            <v-text-field
                                outlined
                                style="display: inline-block; width: 30px;"
                                label="Selling Price"
                                v-model.trim="productItem.selling_price"
                                type="number"
                                step="0.01"
                                @input="validateDecimalSelling"
                                :rules="rule.selling_price"
                            ></v-text-field>
                            <v-autocomplete
                                outlined
                                style="display: inline-block; width: 30px;"
                                v-model.trim="productItem.supplier_id"
                                :items="select.suppliers"
                                item-text="name"
                                item-value="supplier_id"
                                label="Supplier's Name"
                                :rules="rule.supplier"
                                :search-input.sync="add[index].supplier.value"
                            >
                                <template v-slot:no-data>
                                    <span style="margin-left: 10px;">{{ add[index].supplier.value }} <v-btn :loading="loading.supplier" @click="handleAddSupplier(add[index].supplier.value)">Add Supplier?</v-btn></span>
                                </template>
                            </v-autocomplete>
                            <v-btn icon style="margin-top: 5px; color: red" @click="handleRemoveOneItem(index, item.length)"><v-icon>mdi-trash-can</v-icon></v-btn>
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="success"
                            type="submit"
                            :disabled="!valid"
                            :loading="loading.newProduct"
                            style="margin-right: 20px;"
                        >submit</v-btn>
                    </v-card-actions>
                </v-form>
            </div>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data: () => ({
        productNum: {
            status: false,
            value: 1,
            custom: false
        },
        add: [{
            category: {  value: null },
            brand: {  value: null },
            unit: {  value: null },
            supplier: {  value: null },
        }],
        addTemplate: {
            category: {  value: null },
            brand: {  value: null },
            unit: {  value: null },
            supplier: {  value: null },
        },
        loading: {
            newProduct: false,
            category: false,
            brand: false,
            unit: false,
            supplier: false,
        },
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
        item: [
            {
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
            }
        ],
        itemTemplate: {
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
        }
    }),
    props: ['data', 'show'],
    computed: {
        ...mapGetters(['productPostData', 'categoryPostData', 'brandPostData', 'supplierPostData']),
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
        'supplierPostData'(newVal) {
            if (newVal && newVal.STATUS === 200) {
                this.$nextTick(() => {
                    this.loading.supplier = false
                    this.suppliers()
                })
            }
        },
        'unitPostData'(newVal) {
            if (newVal && newVal.STATUS === 200) {
                this.$nextTick(() => {
                    this.loading.unit = false
                    this.units()
                })
            }
        },
        'brandPostData'(newVal) {
            if (newVal && newVal.STATUS === 200) {
                this.$nextTick(() => {
                    this.loading.brand = false
                    this.brands()
                })
            }
        },
        'categoryPostData'(newVal) {
            if (newVal && newVal.STATUS === 200) {
                this.$nextTick(() => {
                    this.loading.category = false
                    this.categories()
                })
            }
        },
        'productNum.value'(newVal) {
            console.log('productNum.value newVal: ', newVal)
            if (newVal) {
                let newArrItem = []
                for (let index = 0; index < newVal; index++) {
                    newArrItem.push(structuredClone(this.itemTemplate))
                }
                this.item = newArrItem

                let newArrAdd = []
                for (let index = 0; index < newVal; index++) {
                    newArrAdd.push(structuredClone(this.addTemplate))
                }
                this.add = newArrAdd
                this.$nextTick(()=>{
                    this.productNum.status = true
                    this.productNum.custom = false
                })
                return
            }
            this.item = [structuredClone(this.itemTemplate)]
            this.add = [structuredClone(this.addTemplate)]
        },
        async productPostData(newVal) {
            this.loading.newProduct = false
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
        ...mapActions(['productPost', 'products', 'getCsrfToken', 'categoryPost', 'categories', 'brandPost', 'brands', 'unitPost', 'units', 'supplierPost', 'suppliers']),
        handleAddSupplier(name) {
            this.loading.supplier = true
            this.supplierPost({ name })
        },
        handleRemoveOneItem(index, itemCount) {
            if (itemCount === 1) {
                this.productNum.status = false
                this.productNum.custom = true
            }
            this.item.splice(index, 1)
        },
        handleKeyDownProductNum(e) {
            e.preventDefault()
        },
        handleSelectProductCount() {
            this.productNum.status = false
            this.productNum.custom = true
            this.productNum.value = null
        },
        handleClickProductNumValue() {
            this.productNum.value = null
        },
        handleAddUnit(name) {
            this.loading.unit = true
            this.unitPost({ name })
        },
        handleAddBrand(name) {
            this.loading.brand = true
            this.brandPost({ name })
        },
        handleAddCategory(name) {
            this.loading.category = true
            this.categoryPost({ name })
        },
        addCustomProduct() {
            this.productNum = {
                value: 1,
                status: false,
                custom: true
            }
        },
        addOneProduct() {
            this.productNum = {
                value: 1,
                status: true,
                custom: false
            }
        },
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
                this.loading.newProduct = true
                await this.getCsrfToken()
                for (let index = 0; index < this.item.length; index++) {
                    this.productPost(this.item[index])
                }
            }
        }
    },
    mounted() {
        if (this.data) this.select = this.data.select
    }
}
</script>

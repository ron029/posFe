<template>
    <v-dialog
        v-model="showDialog"
        :width="productNum.status && productNum.value > 1 ? '100%' : '600px'"
        persistent
    >
        <v-card style="width: 100%">
            <div v-if="!productNum.custom&&!productNum.status">
                <v-card-title>New Product
                    <v-spacer></v-spacer>
                    <v-btn @click="showDialog = false">Close</v-btn>
                </v-card-title>
                <v-card-text>
                    <p>Add 1 product? <v-btn @click="addOneProduct">Yes</v-btn><v-btn @click="addCustomProduct">Custom</v-btn></p>
                </v-card-text>
            </div>
            <div v-if="productNum.custom">
                <v-card-title>New Product <v-spacer></v-spacer><v-btn @click="productNum.custom=false">Back</v-btn></v-card-title>
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
                                <v-form
                                    v-model="valid"
                                    ref="category30"
                                    style="margin-left: 10px;"
                                    @submit.prevent="handleAddCategory(add[0].category.value, 'category30')"
                                >
                                    <v-text-field
                                        dense
                                        hide-details
                                        outlined
                                        style="display: inline-block; margin-left: 10px"
                                        v-model.trim="add[0].category.value"
                                        :rules="[v=>!!v||'Name is required.']"
                                    ></v-text-field>
                                    <v-btn
                                        style="display: inline-block;"
                                        :loading="loading.category"
                                        type="submit"
                                    >Add Category?</v-btn>
                                </v-form>
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
                            ref="brand30"
                        >
                            <template
                                v-slot:no-data
                                v-if="isUserCanCreateBrand"
                            >
                                <v-form
                                    v-model="valid"
                                    ref="brand30"
                                    style="margin-left: 10px;"
                                    @submit.prevent="handleAddBrand(add[0].brand.value, 'brand30')"
                                >
                                    <v-text-field
                                        dense
                                        hide-details
                                        outlined
                                        style="display: inline-block; margin-left: 10px"
                                        v-model="add[0].brand.value"
                                        :rules="[v=>!!v||'Name is required.']"
                                    ></v-text-field>
                                    <v-btn
                                        style="display: inline-block;"
                                        :loading="loading.brand"
                                        type="submit"
                                    >Add Brand?</v-btn>
                                </v-form>
                            </template>
                        </v-autocomplete>
                        <v-text-field
                            label="Product Name"
                            v-model.trim="item[0].name"
                            :rules="rule.name"
                        ></v-text-field>
                        <v-autocomplete
                            v-model.trim="item[0].unit_id"
                            :items="select.units"
                            item-text="name"
                            item-value="unit_id"
                            label="Measurements"
                            :rules="rule.unit"
                            :search-input.sync="add[0].unit.value"
                        >
                            <template
                                v-slot:no-data
                                v-if="isUserCanCreateUnit"
                            >
                                <v-form
                                    v-model="valid"
                                    ref="unit30"
                                    style="margin-left: 10px;"
                                    @submit.prevent="handleAddUnit(add[0].unit.value, 'unit30')"
                                >
                                    <v-text-field
                                        dense
                                        hide-details
                                        outlined
                                        style="display: inline-block; margin-left: 10px"
                                        v-model.trim="add[0].unit.value"
                                        :rules="[v=>!!v||'Name is required.']"
                                    ></v-text-field>
                                    <v-btn
                                        style="display: inline-block;"
                                        :loading="loading.unit"
                                        type="submit"
                                    >Add Unit?</v-btn>
                                </v-form>
                            </template>
                        </v-autocomplete>
                        <v-checkbox
                            label="Auto Generate"
                            v-model="isProductExistingBarcode"
                            @change="isProductExistingBarcode ? item[0].barcode = null : null"
                        ></v-checkbox>
                        <v-text-field
                            :disabled="isProductExistingBarcode"
                            label="Barcode"
                            v-model.trim="item[0].barcode"
                            :rules="rule.barcode"
                            @keyup.enter.prevent
                            @keydown.enter.prevent
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
                            <template
                                v-slot:no-data
                                v-if="isUserCanCreateSupplier"
                            >
                                <v-form
                                    v-model="valid"
                                    ref="supplier30"
                                    style="margin-left: 10px;"
                                    @submit.prevent="handleAddSupplier(add[0].supplier.value, 'supplier30')"
                                >
                                    <v-text-field
                                        dense
                                        hide-details
                                        outlined
                                        style="display: inline-block; margin-left: 10px"
                                        v-model.trim="add[0].supplier.value"
                                        :rules="[v=>!!v||'Name is required.']"
                                    ></v-text-field>
                                    <v-btn
                                        style="display: inline-block;"
                                        :loading="loading.supplier"
                                        type="submit"
                                    >Add Supplier?</v-btn>
                                </v-form>
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
                        <div
                            v-for="(productItem, index) in item"
                            :key="index"
                            :style="`background-color: ${index % 2 == 0 ? '#ddd' : 'white'}; display: flex; width: 100%;`"
                        >
                            <v-hover v-slot="{ hover }" close-delay="100">
                                <!-- category -->
                                <div>
                                    <span
                                        v-if="hover"
                                        x-small
                                        style="color: white; background-color: green; border-radius: 5px; padding: 3px"
                                        @click="applyAll('category_id', productItem.category_id, index)"
                                    >Fill below</span>
                                    <span v-else>&nbsp;</span>
                                    <v-autocomplete
                                        outlined
                                        style="width: 150px; margin-top: 5px"
                                        v-model.trim="productItem.category_id"
                                        :items="select.categories"
                                        item-text="name"
                                        item-value="category_id"
                                        label="Category Name"
                                        :rules="rule.category"
                                        :search-input.sync="add[index].category.value"
                                        dense
                                    >
                                        <template v-slot:no-data>
                                            <v-form
                                                :ref="`category${index}`"
                                                style="margin-left: 10px; width: 100%"
                                                v-model="valid"
                                                @submit.prevent="handleAddCategory(add[index].category.value, `category${index}`)"
                                            >
                                                <v-text-field
                                                    dense
                                                    hide-details
                                                    outlined
                                                    style="display: inline-block; margin-left: 10px"
                                                    v-model="add[index].category.value"
                                                    :rules="[v=>!!v || 'Name is required.']"
                                                ></v-text-field>
                                                <v-btn
                                                    style="display: inline-block"
                                                    :loading="loading.category"
                                                    type="submit"
                                                >Add Category?
                                                </v-btn>
                                            </v-form>
                                        </template>
                                    </v-autocomplete>
                                </div>
                            </v-hover>

                            <v-hover v-slot="{ hover }" close-delay="100">
                                <!-- brand -->
                                <div>
                                    <span
                                        v-if="hover"
                                        x-small
                                        style="color: white; background-color: green; border-radius: 5px; padding: 3px"
                                        @click="applyAll('brand_id', productItem.brand_id, index)"
                                    >Fill below</span>
                                    <span v-else>&nbsp;</span>
                                    <v-autocomplete
                                    style="width: 150px; margin-top: 5px"
                                        outlined
                                        v-model.trim="productItem.brand_id"
                                        :items="select.brands"
                                        item-text="name"
                                        item-value="brand_id"
                                        label="Brand Name"
                                        :rules="rule.brand"
                                        :search-input.sync="add[index].brand.value"
                                        dense
                                    >
                                        <template
                                            v-slot:no-data
                                            v-if="isUserCanCreateBrand"
                                        >
                                            <v-form
                                                :ref="`brand${index}`"
                                                style="margin-left: 10px;"
                                                v-model="valid"
                                                @submit.prevent="handleAddBrand(add[index].brand.value, `brand${index}`)"
                                            >
                                                <v-text-field
                                                    dense
                                                    hide-details
                                                    outlined
                                                    style="display: inline-block; margin-left: 10px"
                                                    v-model="add[index].brand.value"
                                                    :rules="[v=>!!v || 'Name is required.']"
                                                ></v-text-field>
                                                <v-btn
                                                    :loading="loading.brand"
                                                    type="submit"
                                                >Add Brand?
                                                </v-btn>
                                            </v-form>
                                        </template>
                                    </v-autocomplete>
                                </div>
                            </v-hover>

                            <v-hover v-slot="{ hover }" close-delay="100">
                                <!-- product name -->
                                <div>
                                    <span
                                        v-if="hover"
                                        x-small
                                        style="color: white; background-color: green; border-radius: 5px; padding: 3px"
                                        @click="applyAll('name', productItem.name, index)"
                                    >Fill below</span>
                                    <span v-else>&nbsp;</span>
                                    <v-text-field
                                        style="width: 150px; margin-top: 5px;"
                                        outlined
                                        label="Product Name"
                                        v-model.trim="productItem.name"
                                        :rules="[v=>!!v || 'Name is required.']"
                                        dense
                                    ></v-text-field>
                                </div>
                            </v-hover>

                            <v-hover v-slot="{ hover }" close-delay="100">
                                <!-- unit -->
                                <div>
                                    <span
                                        v-if="hover"
                                        x-small
                                        style="color: white; background-color: green; border-radius: 5px; padding: 3px"
                                        @click="applyAll('unit_id', productItem.unit_id, index)"
                                    >Fill below</span>
                                    <span v-else>&nbsp;</span>
                                    <v-autocomplete
                                        style="width: 150px; margin-top: 5px"
                                        outlined
                                        v-model.trim="productItem.unit_id"
                                        :items="select.units"
                                        item-text="name"
                                        item-value="unit_id"
                                        label="Measurements"
                                        :rules="rule.unit"
                                        :search-input.sync="add[index].unit.value"
                                        dense
                                    >
                                        <template
                                            v-slot:no-data
                                            v-if="isUserCanCreateUnit"
                                        >
                                            <v-form
                                                :ref="`unit${index}`"
                                                style="margin-left: 10px;"
                                                v-model="valid"
                                                @submit.prevent="handleAddUnit(add[index].unit.value, `unit${index}`)"
                                            >
                                                <v-text-field
                                                    dense
                                                    hide-details
                                                    outlined
                                                    style="display: inline-block; margin-left: 10px"
                                                    v-model="add[index].unit.value"
                                                    :rules="[v=>!!v || 'Name is required.']"
                                                ></v-text-field>
                                                <v-btn
                                                    :loading="loading.unit"
                                                    type="submit"
                                                >Add Unit?
                                                </v-btn>
                                            </v-form>
                                        </template>
                                    </v-autocomplete>
                                </div>
                            </v-hover>

                            <!-- product name -->
                            <div>
                                <v-text-field
                                    disabled
                                    style="width: 286px; margin-top: 27px;"
                                    outlined
                                    label="Product Name"
                                    :value="formatName(select?.brands?.filter(item => item.brand_id == productItem.brand_id)[0]?.name, productItem.name, select?.units?.filter(item => item.unit_id == productItem.unit_id)[0]?.name)"
                                    dense
                                    :rules="[v=>!!v || 'Name is required.']"
                                ></v-text-field>
                            </div>

                            <!-- barcode -->
                            <div>
                                <v-checkbox
                                    style="height: 23px !important; padding: 0; margin: 0"
                                    outlined
                                    hide-details
                                    label="Auto Generate"
                                    v-model.trim="productItem.barcode_exist"
                                    @keydown.enter.prevent
                                    @keyup.enter.prevent
                                    :rules="rule.barcode"
                                    @change="productItem.barcode_exist ? productItem.barcode = null : ''"
                                    dense
                                ></v-checkbox>
                                <v-text-field
                                    style="width: 135px; margin-top: 5px"
                                    outlined
                                    label="Barcode"
                                    v-model.trim="productItem.barcode"
                                    @keydown.enter.prevent
                                    @keyup.enter.prevent
                                    :disabled="productItem.barcode_exist"
                                    dense
                                ></v-text-field>
                            </div>

                            <!-- quantity -->
                            <v-hover v-slot="{ hover }" close-delay="100">
                                <div>
                                    <span
                                        v-if="hover"
                                        x-small
                                        style="color: white; background-color: green; border-radius: 5px; padding: 3px"
                                        @click="applyAll('quantity', productItem.quantity, index)"
                                    >Fill below</span>
                                    <span v-else>&nbsp;</span>
                                    <v-text-field
                                        style="margin-top: 5px"
                                        outlined
                                        label="Quantity"
                                        type="number"
                                        v-model.trim=productItem.quantity
                                        :rules="rule.quantity"
                                        dense
                                    ></v-text-field>
                                </div>
                            </v-hover>

                            <!-- reorder_level -->
                            <v-hover v-slot="{ hover }" close-delay="100">
                                <div>
                                    <span
                                        v-if="hover"
                                        x-small
                                        style="color: white; background-color: green; border-radius: 5px; padding: 3px"
                                        @click="applyAll('reorder_level', productItem.reorder_level, index)"
                                    >Fill below</span>
                                    <span v-else>&nbsp;</span>
                                    <v-text-field
                                        style="margin-top: 5px"
                                        outlined
                                        label="Reorder Level"
                                        v-model.trim="productItem.reorder_level"
                                        type="number"
                                        :rules="rule.reorder_level"
                                        dense
                                    ></v-text-field>
                                </div>
                            </v-hover>

                            <!-- cost_price -->
                            <v-hover v-slot="{ hover }" close-delay="100">
                                <div>
                                    <span
                                        v-if="hover"
                                        x-small
                                        style="color: white; background-color: green; border-radius: 5px; padding: 3px"
                                        @click="applyAll('cost_price', productItem.cost_price, index)"
                                    >Fill below</span>
                                    <span v-else>&nbsp;</span>
                                    <v-text-field
                                        style="margin-top: 5px"
                                        outlined
                                        label="Cost Price"
                                        v-model.trim="productItem.cost_price"
                                        type="number"
                                        step="0.01"
                                        @input="validateDecimalCost"
                                        :rules="rule.cost_price"
                                        dense
                                    ></v-text-field>
                                </div>
                            </v-hover>

                            <!-- selling_price -->
                            <v-hover v-slot="{ hover }" close-delay="100">
                                <div>
                                    <span
                                        v-if="hover"
                                        x-small
                                        style="color: white; background-color: green; border-radius: 5px; padding: 3px"
                                        @click="applyAll('selling_price', productItem.selling_price, index)"
                                    >Fill below</span>
                                    <span v-else>&nbsp;</span>
                                    <v-text-field
                                        style="margin-top: 5px"
                                        outlined
                                        label="Selling Price"
                                        v-model.trim="productItem.selling_price"
                                        type="number"
                                        step="0.01"
                                        @input="validateDecimalSelling"
                                        :rules="rule.selling_price"
                                        dense
                                    ></v-text-field>
                                </div>
                            </v-hover>

                            <!-- supplier_id -->
                            <v-hover v-slot="{ hover }" close-delay="100">
                                <div>
                                    <span
                                        v-if="hover"
                                        x-small
                                        style="color: white; background-color: green; border-radius: 5px; padding: 3px"
                                        @click="applyAll('supplier_id', productItem.supplier_id, index)"
                                    >Fill below</span>
                                    <span v-else>&nbsp;</span>
                                    <v-autocomplete
                                        style="margin-top: 5px"
                                        outlined
                                        v-model.trim="productItem.supplier_id"
                                        :items="select.suppliers"
                                        item-text="name"
                                        item-value="supplier_id"
                                        label="Supplier's Name"
                                        :rules="rule.supplier"
                                        :search-input.sync="add[index].supplier.value"
                                        dense
                                    >
                                        <template
                                            v-slot:no-data
                                            v-if="isUserCanCreateSupplier"
                                        >
                                            <v-form
                                                :ref="`supplier${index}`"
                                                style="margin-left: 10px;"
                                                v-model="valid"
                                                @submit.prevent="handleAddSupplier(add[index].supplier.value, `supplier${index}`)"
                                            >
                                                <v-text-field
                                                    dense
                                                    hide-details
                                                    outlined
                                                    style="display: inline-block; margin-left: 10px"
                                                    v-model="add[index].supplier.value"
                                                    :rules="[v=>!!v || 'Name is required.']"
                                                ></v-text-field>
                                                <v-btn
                                                    :loading="loading.supplier"
                                                    type="submit"
                                                >Add Supplier?
                                                </v-btn>
                                            </v-form>
                                        </template>
                                    </v-autocomplete>
                                </div>
                            </v-hover>
                            <v-btn icon style="margin-top: 28px; color: red" @click="handleRemoveOneItem(index, item.length)"><v-icon>mdi-trash-can</v-icon></v-btn>
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
        isProductExistingBarcode: false,
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
            name: [ v => v && !!v.trim() || 'Product Name is required', v => v && v.length <= 26 || 'Not more then 26 char' ],
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
                barcode_exist: false,
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
            barcode_exist: false,
        }
    }),
    props: ['data', 'show'],
    computed: {
        ...mapGetters(['productPostData', 'categoryPostData', 'brandPostData', 'supplierPostData', 'unitPostData', 'findUserRolePermissionData']),
        isUserCanCreateSupplier() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'supplier:0')
            return false
        },
        isUserCanCreateBrand() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'brand:0')
            return false
        },
        isUserCanCreateUnit() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'unit:0')
            return false
        },
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
        async 'loading.newProduct'(newVal) {
            if (!newVal) {
                this.$emit('closeAddProduct')
                await this.getCsrfToken()
                this.products()
            }
        },
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
                    this.addTemplate
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
        data: {
            handler(newVal) {
                this.select = newVal.select
            },
            deep: true
        }
    },
    methods: {
        ...mapActions(['productPost', 'products', 'getCsrfToken', 'categoryPost', 'categories', 'brandPost', 'brands', 'unitPost', 'units', 'supplierPost', 'suppliers']),
        formatName(brand, name, measurement) {
            return `${brand ? brand : ''} ${name ? name : ''} ${measurement ? measurement : ''}`
        },
        applyAll(field, category_id, index) {
            for (let i=index; i<this.item.length; i++) {
                this.item[i][field] = category_id
            }
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
        handleAddSupplier(name, ref) {
            this.$nextTick(()=>{
                if (this.$refs && this.$refs[ref]) {
                    if (this.$refs[ref]?.[0]?.validate()) {
                        this.loading.supplier = true
                        this.supplierPost({ name })
                    } else if (this.$refs[ref]?.validate()) {
                        this.loading.supplier = true
                        this.supplierPost({ name })
                    }
                }
            })
        },
        handleAddUnit(name, ref) {
            this.$nextTick(()=>{
                if (this.$refs && this.$refs[ref]) {
                    if (this.$refs[ref]?.[0]?.validate()) {
                        this.loading.unit = true
                        this.unitPost({ name })
                    } else if (this.$refs[ref]?.validate()) {
                        this.loading.unit = true
                        this.unitPost({ name })
                    }
                }
            })
        },
        handleAddBrand(name, ref) {
            this.$nextTick(()=>{
                if (this.$refs && this.$refs[ref]) {
                    if (this.$refs[ref]?.[0]?.validate()) {
                        this.loading.brand = true
                        this.brandPost({ name })
                    } else if (this.$refs[ref]?.validate()) {
                        this.loading.brand = true
                        this.brandPost({ name })
                    }
                }
            })
        },
        handleAddCategory(name, ref) {
            this.$nextTick(()=>{
                if (this.$refs && this.$refs[ref]) {
                    if (Array.isArray(this.$refs[ref])) {
                        if (this.$refs[ref][0]?.validate()) {
                            this.loading.category = true;
                            this.categoryPost({ name });
                        }
                    } else if (this.$refs[ref]?.validate()) {
                        this.loading.category = true;
                        this.categoryPost({ name });
                    }
                }
            })
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
                    await this.productPost(this.item[index])
                }
                this.loading.newProduct = false
            }
        }
    },
    mounted() {
        if (this.data) this.select = this.data.select
    }
}
</script>

<template>
    <div style="padding: 0 20px">
        <h1>Inventory</h1>
        <v-card style="margin-bottom: 5px">
            <v-card-text>
                <v-btn @click="showProductForm" :disabled="!isUserCanCreateProducts">Add Products</v-btn>
                <v-btn @click="show.unit = true">Measurement</v-btn>
                <v-btn @click="show.category = true">Categories</v-btn>
                <v-btn @click="show.brand = true">Brands</v-btn>
                <v-btn @click="show.supplier = true">Suppliers</v-btn>
                <v-btn v-show="false" @click="show.import = true">Import</v-btn>
                <v-btn v-show="false" @click="productExport">Export</v-btn>
                <v-btn @click="show.productExpire = true">Product Expiry Dates</v-btn>
            </v-card-text>
        </v-card>
        <v-text-field
            style="margin-bottom: 10px"
            label="Search"
            append-icon="mdi-magnify"
            :hide-details="true"
            single-line
            clearable
            v-model="searchQuery"
            @keydown.enter.prevent="search = searchQuery"
            @click:append="search = searchQuery"
        ></v-text-field>
        <v-card>
            <v-data-table
                :headers="productHeaders"
                :items="productItems"
                dense
                :search="search"
            >
                <template slot="item.actions" slot-scope="{ item }">
                    <v-icon
                        @click="editItem(item)"
                        color="warning"
                        :disabled="!isUserCanUpdateProducts"
                    >mdi-pencil</v-icon>
                    <v-icon disabled @click="deleteItem(item)" color="error">mdi-trash-can</v-icon>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-if="show.productEdit">
            <v-card>
                <v-card-title>

                </v-card-title>
            </v-card>
        </v-dialog>
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
        <addPage
            v-if="show.product.status"
            :data="{select}"
            :show="show.product.status"
            @closeAddProduct="show.product.status = false"
        />
        <editPage
            v-if="show.product.edit"
            :data="{select, item: show.product.data}"
            :show="show.product.edit"
            @closeEditProduct="show.product.edit = false"
        />
        <deletePage
            v-if="show.product.delete"
            :data="{item: show.product.data}"
            :show="show.product.delete"
            @closeDeleteDialog="show.product.delete = false"
        />
        <PrductExpirationPage
            v-if="show.productExpire"
            :show="show.productExpire"
            @closeDialog="show.productExpire = false"
        />
    </div>
</template>

<script>
import PrductExpirationPage from './ProductExpirationPage/IndexPage.vue';
import deletePage from './dialogs/ProductPage/DeletePage.vue';
import addPage from './dialogs/ProductPage/AddPage.vue';
import showBrand from './dialogs/BrandPage.vue';
import showSupplier from './dialogs/SupplierPage.vue';
import showUnit from './dialogs/UnitPage.vue';
import showCategory from './dialogs/CategoryPage.vue';
import { mapActions, mapGetters } from 'vuex';
import editPage from './dialogs/ProductPage/EditPage.vue';
export default {
    components: {
        deletePage, addPage, editPage, showBrand, showSupplier, showUnit, showCategory, PrductExpirationPage,
    },
    data: ()=>({
        show: {
            product: {
                status: false,
                delete: false,
                edit: false,
                data: [],
            },
            import: false,
            export: false,
            unit: false,
            category: false,
            brand: false,
            supplier: false,
            productExpire: false,
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
            barcode: null,
            name: null,
            selling_price: null,
            quantity: null,
            reorder_level: null,
        },
        productHeaders: [
            { text: 'Category', value: 'category' },
            { text: 'Brand', value: 'brand' },
            { text: 'Name', value: 'name' },
            { text: 'Unit', value: 'unit' },
            { text: 'Barcode', value: 'barcode' },
            { text: 'Quantity', value: 'quantity' },
            { text: 'Reorder Level', value: 'reorder_level' },
            { text: 'Cost Price', value: 'cost_price' },
            { text: 'Selling Price', value: 'selling_price' },
            { text: 'Supplier', value: 'supplier' },
            { text: 'Actions', value: 'actions' }
        ],
        productItems: [],
        search: null,
        searchQuery: null,
    }),
    computed: {
        ...mapGetters(['unitData', 'categoryData', 'brandData', 'supplierData', 'productData', 'productExportData', 'findUserRolePermissionData']),
        isUserCanReadSuppliers() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'supplier:1')
            return false
        },
        isUserCanReadBrands() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'brand:1')
            return false
        },
        isUserCanReadCategories() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'category:1')
            return false
        },
        isUserCanReadUnits() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'unit:1')
            return false
        },
        isUserCanReadProducts() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'product:1')
            return false
        },
        isUserCanCreateProducts() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'product:0')
            return false
        },
        isUserCanUpdateProducts() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'product:2')
            return false
        }
    },
    watch: {
        'show.productExpire'(newVal) {
            console.log('show.productExpire newVal: ', newVal)
        },
        searchQuery(newVal) {
            if (newVal === null || newVal === '')
                this.search = null
        },
        productExportData(newVal) {
            if (newVal) {
                try {
                    const buffer = new Uint8Array(newVal.DATA.excel.data);
                    const blob = new Blob([buffer], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    });

                    // Create download link
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `products-${new Date().toISOString().split('T')[0]}.xlsx`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                } catch (err) {
                    console.log('productExportData newVal: ', newVal)
                }

            }
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
        ...mapActions(['getCsrfToken', 'units', 'categories', 'brands', 'suppliers', 'products', 'productPost', 'productExport']),
        editItem(item) {
            let stageItem = item
            delete stageItem.unit
            delete stageItem.brand
            delete stageItem.supplier
            delete stageItem.category
            delete stageItem.unit
            this.show.product.data = item
            this.show.product.edit = !this.show.product.edit
        },
        deleteItem(item) {
            this.show.product.data = item
            this.show.product.delete = !this.show.product.delete
        },
        showProductForm() {
            this.show.product.status = !this.show.product.status
        },
    },
    async mounted() {
        await this.getCsrfToken()
        if (this.isUserCanReadUnits)
            this.units()
        if (this.isUserCanReadCategories)
            this.categories()
        if (this.isUserCanReadBrands)
            this.brands()
        if (this.isUserCanReadSuppliers)
            this.suppliers()
        if (this.isUserCanReadProducts)
            this.products()
    }
}
</script>

<style scoped>
.v-card__text button {
    margin-right: 10px;
}
</style>

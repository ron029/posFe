<template>
    <div style="width: 100%;">
        <h1>Inventory Page</h1>
        <v-btn @click="showProductForm">Add Products</v-btn>
        <v-btn @click="show.unit = true">Measurement</v-btn>
        <v-btn @click="show.category = true">Categories</v-btn>
        <v-btn @click="show.brand = true">Brands</v-btn>
        <v-btn @click="show.supplier = true">Suppliers</v-btn>
        <v-card>
            <v-data-table
                :headers="productHeaders"
                :items="productItems"
                dense
            >
                <template slot="item.actions" slot-scope="{ item }">
                    <v-icon @click="editItem(item)" color="warning">mdi-pencil</v-icon>
                    <v-icon @click="deleteItem(item)" color="error">mdi-trash-can</v-icon>
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
    </div>
</template>

<script>
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
        deletePage,
        addPage,
        editPage,
        showBrand,
        showSupplier,
        showUnit,
        showCategory,
    },
    data: ()=>({
        show: {
            product: {
                status: false,
                delete: false,
                edit: false,
                data: [],
            },
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
            barcode: null,
            name: null,
            selling_price: null,
            quantity: null,
            reorder_level: null,
        },
        productHeaders: [
            { text: 'Name', value: 'name' },
            { text: 'Cost Price', value: 'cost_price' },
            { text: 'Selling Price', value: 'selling_price' },
            { text: 'Barcode', value: 'barcode' },
            { text: 'Quantity', value: 'quantity' },
            { text: 'Reorder Level', value: 'reorder_level' },
            { text: 'Unit', value: 'unit' },
            { text: 'Brand', value: 'brand' },
            { text: 'Category', value: 'category' },
            { text: 'Supplier', value: 'supplier' },
            { text: 'Actions', value: 'actions' }
        ],
        productItems: [],
    }),
    computed: {
        ...mapGetters(['unitData', 'categoryData', 'brandData', 'supplierData', 'productData'])
    },
    watch: {
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
        this.units()
        this.categories()
        this.brands()
        this.suppliers()
        this.products()
    }
}
</script>

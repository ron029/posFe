<template>
    <v-dialog
        v-model="showDialog"
        width="405px"
    >
        <v-card>
            <v-data-table
                :headers="headers"
                :items="tblItems"
                dense
                :search="search.commit"
            >
                <template slot="top">
                    <v-toolbar flat>
                        <v-toolbar-title>Brands</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn @click="newBrandItem()" :disabled="!isUserCanCreateBrands" color="success"><v-icon>mdi-plus</v-icon>New</v-btn>
                    </v-toolbar>
                    <v-text-field
                        style="margin: 0 17px"
                        label="Search"
                        v-model="search.placeholder"
                        append-icon="mdi-magnify"
                        @click:append="search.commit=search.placeholder"
                        @keydown.enter="search.commit=search.placeholder"
                        clearable
                        @click:clear="search.commit=''"
                    ></v-text-field>
                </template>
                <template slot="item.actions" slot-scope="{ item }">
                    <v-icon @click="editItem(item)" :disabled="!isUserCanUpdateBrands" color="warning">mdi-pencil</v-icon>
                    <v-icon @click="deleteItem(item)" disabled color="error">mdi-trash-can</v-icon>
                </template>
            </v-data-table>
        </v-card>

    <!-- dialogs -->
        <!-- dialogs edit -->
        <v-dialog
            v-model="showDialogEdit"
            width="400px"
        >
            <v-form
                ref="editBrand"
                @submit.prevent="editBrand()"
                v-model="valid.edit"
            >
                <v-card>
                    <v-card-title>Edit: {{ this.currentItem?.name }}</v-card-title>
                    <v-card-text>
                        <v-text-field
                            label="Brand Name"
                            v-model="newItem.name"
                            :rules="[v=>v && !!v.trim()||'Brand Name is required']"
                            clearable
                        ></v-text-field>
                        <v-text-field
                            label="Abbr"
                            v-model="newItem.abbr"
                            :rules="[v=>v && !!v.trim()||'Abbr is required']"
                            clearable
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="showDialogEdit=false">cancel</v-btn>
                        <v-btn color="success" type="submit" :disabled="!valid.edit">proceed</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

        <!-- dialogs new -->
        <v-dialog
            v-model="showDialogNew"
            width="400px"
        >
            <v-form
                ref="newBrand"
                @submit.prevent="newBrand()"
                v-model="valid.new"
            >
                <v-card>
                    <v-card-title>New Brands</v-card-title>
                    <v-card-text>
                        <v-text-field
                            v-model="newItem.name"
                            label="Brand Name"
                            :rules="[v=>v && !!v.trim()||'Brand Name is required']"
                            clearable
                        ></v-text-field>
                        <v-text-field
                            v-model="newItem.abbr"
                            label="Abbr"
                            :rules="[v=>v && !!v.trim()||'Abbr is required']"
                            clearable
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="showDialogNew = false">cancel</v-btn>
                        <v-btn color="success" type="submit" :disabled="!valid.new">submit</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

        <!-- dialogs delete -->
        <v-dialog
            v-model="showDialogDelete"
            width="400px"
        >
            <v-card>
                <v-card-title color="error">Delete Brand named {{ this.currentItem?.name }}?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="showDialogDelete=false">cancel</v-btn>
                    <v-btn disabled color="success" @click="deleteBrand">proceed</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    <!-- /dialogs -->
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data: ()=>({
        loading: false,
        search: {
            placeholder: null,
            commit: ""
        },
        valid: {
            edit: false,
            new: false,
        },
        action: {
            edit: false,
            delete: false,
            new: false
        },
        currentItem: null,
        newItem: {
            name: null,
            abbr: null
        },
        headers: [
            { text: 'Brand Name', value: 'name' },
            { text: 'Abbr', value: 'abbr' },
            { text: 'Actions', value: 'actions' },
        ],
        tblItems: [],
    }),
    props: ['show'],
    computed: {
        ...mapGetters(['brandData', 'brandPostData', 'brandDeleteData', 'brandPutData', 'findUserRolePermissionData']),
        isUserCanReadBrands() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'brand:read')
            return false
        },
        isUserCanCreateBrands() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'brand:create')
            return false
        },
        isUserCanUpdateBrands() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'brand:update')
            return false
        },
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.$emit('hideBrand')
            }
        },
        showDialogEdit: {
            get() {
                return this.action.edit
            },
            set() {
                this.action.edit = false
            }
        },
        showDialogDelete: {
            get() {
                return this.action.delete
            },
            set() {
                this.action.delete = false
            }
        },
        showDialogNew: {
            get() {
                return this.action.new
            },
            set() {
                this.action.new = false
            }
        }
    },
    watch: {
        'search.placeholder'(newVal) {
            if (newVal === '') this.search.commit = ''
        },
        brandPostData(newVal) {
            if (newVal.STATUS === 200) {
                this.newItem.brand_id = newVal.DATA.insertId
                this.createBrandItem()
            }
            this.loading = false
        },
        brandData(newVal) {
            if (newVal.STATUS === 200) {
                this.tblItems = newVal.DATA
            }
            this.loading = false
        },
        brandPutData(newVal) {
            if (newVal.STATUS === 200) {
                this.updateBrandItems()
            }
            this.loading = false
        },
        async brandDeleteData(newVal) {
            if (newVal.STATUS === 200) {
                // this.removeBrandItem()
                await this.getCsrfToken()
                this.brands()
            }
            this.loading = false
        },
        async show() {
            await this.getCsrfToken()
            if (this.isUserCanReadBrands)
                this.brands()
        }
    },
    methods: {
        ...mapActions(['getCsrfToken', 'brands', 'brandPost', 'brandDelete', 'brandPut']),
        async newBrand() {
            if (this.$refs.newBrand.validate()) {
                this.loading = true
                await this.getCsrfToken()
                this.brandPost(this.newItem)
                this.action.new = false
            }
        },
        async editBrand() {
            if (this.$refs.editBrand.validate()) {
                this.loading = true
                await this.getCsrfToken()
                this.brandPut(this.newItem)
                this.action.edit = false
            }
        },
        async deleteBrand() {
            this.loading = true
            await this.getCsrfToken()
            this.brandDelete({brand_id: this.currentItem.brand_id})
            this.action.delete = false
        },
        newBrandItem() {
            this.newItem = {name: '', brand_id: null}
            this.$refs?.newBrand?.reset()
            this.action.new = true
        },
        editItem(item) {
            this.currentItem = item
            this.newItem = structuredClone(item);
            this.action.edit = true
        },
        deleteItem(item) {
            this.currentItem = item
            this.action.delete = true
        },
        createBrandItem() {
            this.tblItems.unshift(this.newItem);
        },
        updateBrandItems() {
            const index = this.tblItems.findIndex(
                (item) => item.brand_id === this.newItem.brand_id
            );

            if (index !== -1) {
                // Update the matched object with the newItem
                this.tblItems.splice(index, 1, this.newItem);
            } else {
                console.warn("No matching brand_id found in tblItems");
            }
        },
        removeBrandItem() {
            const index = this.tblItems.findIndex(
                (item) => item.brand_id === this.newItem.brand_id
            );

            if (index !== -1) {
                // Remove the matched object
                this.tblItems.splice(index, 1);
            } else {
                console.warn("No matching brand_id found in tblItems");
            }
        }
    },
}
</script>

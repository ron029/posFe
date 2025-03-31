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
                        <v-toolbar-title>Suppliers</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn @click="newSupplierItem" :disabled="!isUserCanCreateSuppliers" color="success"><v-icon>mdi-plus</v-icon>New</v-btn>
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
                    <v-icon @click="editItem(item)" :disabled="!isUserCanUpdateSuppliers" color="warning">mdi-pencil</v-icon>
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
                ref="editSupplier"
                @submit.prevent="editSupplier()"
                v-model="valid.edit"
            >
                <v-card>
                    <v-card-title>Edit: {{ this.currentItem?.name }}</v-card-title>
                    <v-card-text>
                        <v-text-field
                            label="Suppliers Name"
                            v-model="newItem.name"
                            :rules="rules.edit"
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
                ref="newSupplier"
                @submit.prevent="newSupplier()"
                v-model="valid.new"
            >
                <v-card>
                    <v-card-title>New Suppliers</v-card-title>
                    <v-card-text>
                        <v-text-field
                            v-model="newItem.name"
                            label="Supplier Name"
                            :rules="rules.new"
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
                <v-card-title color="error">Delete Supplier named {{ this.currentItem?.name }}?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="showDialogDelete=false">cancel</v-btn>
                    <v-btn disabled color="success" @click="deleteSupplier">proceed</v-btn>
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
        rules: {
            new: [v=>v && !!v.trim()||'Supplier Name is required'],
            edit: [v=>v && !!v.trim()||'Supplier Name is required']
        },
        action: {
            edit: false,
            delete: false,
            new: false
        },
        currentItem: null,
        newItem: {
            name: null
        },
        headers: [
            { text: 'Suppier Name', value: 'name' },
            { text: 'Actions', value: 'actions' },
        ],
        tblItems: [],
    }),
    props: ['show'],
    computed: {
        ...mapGetters(['supplierData', 'supplierPostData', 'supplierDeleteData', 'supplierPutData', 'findUserRolePermissionData']),
        isUserCanReadSuppliers() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'supplier:1')
            return false
        },
        isUserCanCreateSuppliers() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'supplier:0')
            return false
        },
        isUserCanUpdateSuppliers() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'supplier:2')
            return false
        },
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.$emit('hideSupplier')
                this.suppliers()
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
        supplierPostData(newVal) {
            if (newVal.STATUS === 200) {
                this.newItem.supplier_id = newVal.DATA.insertId
                this.createSupplierItem()
            }
            this.loading = false
        },
        supplierData(newVal) {
            if (newVal.STATUS === 200) {
                this.tblItems = newVal.DATA
            }
            this.loading = false
        },
        supplierPutData(newVal) {
            if (newVal.STATUS === 200) {
                this.updateSupplierItems()
            }
            this.loading = false
        },
        async supplierDeleteData(newVal) {
            if (newVal.STATUS === 200) {
                // this.removeSupplierItem()
                await this.getCsrfToken()
                this.suppliers()
            }
            this.loading = false
        },
        async show() {
            await this.getCsrfToken()
            if (this.isUserCanReadSuppliers)
                this.suppliers()
        }
    },
    methods: {
        ...mapActions(['getCsrfToken', 'suppliers', 'supplierPost', 'supplierDelete', 'supplierPut']),
        async newSupplier() {
            if (this.$refs.newSupplier.validate()) {
                this.loading = true
                await this.getCsrfToken()
                this.supplierPost(this.newItem)
                this.action.new = false
            }
        },
        async editSupplier() {
            if (this.$refs.editSupplier.validate()) {
                this.loading = true
                await this.getCsrfToken()
                this.supplierPut(this.newItem)
                this.action.edit = false
            }
        },
        async deleteSupplier() {
            this.loading = true
            await this.getCsrfToken()
            this.supplierDelete({supplier_id: this.currentItem.supplier_id})
            this.action.delete = false
        },
        newSupplierItem() {
            this.newItem = {name: '', supplier_id: null}
            this.$refs?.newSupplier?.reset()
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
        createSupplierItem() {
            this.tblItems.unshift(this.newItem);
        },
        updateSupplierItems() {
            const index = this.tblItems.findIndex(
                (item) => item.supplier_id === this.newItem.supplier_id
            );

            if (index !== -1) {
                // Update the matched object with the newItem
                this.tblItems.splice(index, 1, this.newItem);
            } else {
                console.warn("No matching supplier_id found in tblItems");
            }
        },
        removeSupplierItem() {
            const index = this.tblItems.findIndex(
                (item) => item.supplier_id === this.newItem.supplier_id
            );

            if (index !== -1) {
                // Remove the matched object
                this.tblItems.splice(index, 1);
            } else {
                console.warn("No matching supplier_id found in tblItems");
            }
        }
    },
}
</script>

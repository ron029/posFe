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
                        <v-toolbar-title>Categories</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn @click="newCatItem()" color="success"><v-icon>mdi-plus</v-icon>New</v-btn>
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
                    <v-icon @click="editItem(item)" color="warning">mdi-pencil</v-icon>
                    <v-icon @click="deleteItem(item)" color="error">mdi-trash-can</v-icon>
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
                ref="editCategory"
                @submit.prevent="editCategory()"
                v-model="valid.edit"
            >
                <v-card>
                    <v-card-title>Edit: {{ this.currentItem?.name }}</v-card-title>
                    <v-card-text>
                        <v-text-field
                            label="Category Name"
                            v-model="newItem.name"
                            :rules="[v=>v && !!v.trim()||'Category Name is required']"
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
                ref="newCategory"
                @submit.prevent="newCategory()"
                v-model="valid.new"
            >
                <v-card>
                    <v-card-title>New Categorys</v-card-title>
                    <v-card-text>
                        <v-text-field
                            v-model="newItem.name"
                            label="Category Name"
                            :rules="[v=>v && !!v.trim()||'Category Name is required']"
                            clearable
                        ></v-text-field>
                        <v-text-field
                            v-model="newItem.abbr"
                            label="Abbr"
                            :rules="[v=>v && !!v.trim()||'Abbr Name is required']"
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
                <v-card-title color="error">Delete Category named {{ this.currentItem?.name }}?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="showDialogDelete=false">cancel</v-btn>
                    <v-btn color="success" @click="deleteCategory">proceed</v-btn>
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
            abbr: null,
        },
        headers: [
            { text: 'Category Name', value: 'name' },
            { text: 'Abbr', value: 'abbr' },
            { text: 'Actions', value: 'actions' },
        ],
        tblItems: [],
    }),
    props: ['show'],
    computed: {
        ...mapGetters(['categoryData', 'categoryPostData', 'categoryDeleteData', 'categoryPutData']),
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.$emit('hideCategory')
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
        categoryPostData(newVal) {
            if (newVal.STATUS === 200) {
                this.newItem.category_id = newVal.DATA.insertId
                this.createCategoryItem()
            }
            this.loading = false
        },
        categoryData(newVal) {
            if (newVal.STATUS === 200) {
                this.tblItems = newVal.DATA
            }
            this.loading = false
        },
        categoryPutData(newVal) {
            if (newVal.STATUS === 200) {
                this.updateCategoryItems()
            }
            this.loading = false
        },
        async categoryDeleteData(newVal) {
            if (newVal.STATUS === 200) {
                // this.removeCategoryItem()
                await this.getCsrfToken()
                this.categories()
            }
            this.loading = false
        },
        async show() {
            await this.getCsrfToken()
            this.categories()
        }
    },
    methods: {
        ...mapActions(['getCsrfToken', 'categories', 'categoryPost', 'categoryDelete', 'categoryPut']),
        async newCategory() {
            if (this.$refs.newCategory.validate()) {
                this.loading = true
                await this.getCsrfToken()
                this.categoryPost(this.newItem)
                this.action.new = false
            }
        },
        async editCategory() {
            if (this.$refs.editCategory.validate()) {
                this.loading = true
                await this.getCsrfToken()
                this.categoryPut(this.newItem)
                this.action.edit = false
            }
        },
        async deleteCategory() {
            this.loading = true
            await this.getCsrfToken()
            this.categoryDelete({category_id: this.currentItem.category_id})
            this.action.delete = false
        },
        newCatItem() {
            this.newItem = {name: '', category_id: null}
            this.$refs?.newCategory?.reset()
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
        createCategoryItem() {
            this.tblItems.unshift(this.newItem);
        },
        updateCategoryItems() {
            const index = this.tblItems.findIndex(
                (item) => item.category_id === this.newItem.category_id
            );

            if (index !== -1) {
                // Update the matched object with the newItem
                this.tblItems.splice(index, 1, this.newItem);
            } else {
                console.warn("No matching category_id found in tblItems");
            }
        },
        removeCategoryItem() {
            const index = this.tblItems.findIndex(
                (item) => item.category_id === this.newItem.category_id
            );

            if (index !== -1) {
                // Remove the matched object
                this.tblItems.splice(index, 1);
            } else {
                console.warn("No matching category_id found in tblItems");
            }
        }
    },
}
</script>

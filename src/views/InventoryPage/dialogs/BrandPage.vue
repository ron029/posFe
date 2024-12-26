<template>
    <v-dialog v-model="showDialog">
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
                        <v-btn @click="newBrandItem()" color="success"><v-icon>mdi-plus</v-icon>New</v-btn>
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
                            :rules="rules.edit"
                            clearable
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="success" @click="showDialogEdit=false">cancel</v-btn>
                        <v-btn color="error" type="submit" :disabled="!valid.edit">procceed</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

        <!-- dialogs new -->
        <v-dialog v-model="showDialogNew">
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
        <v-dialog v-model="showDialogDelete">
            <v-card>
                <v-card-title color="error">Delete Brand named {{ this.currentItem?.name }}?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="showDialogDelete=false">cancel</v-btn>
                    <v-btn color="error" @click="deleteBrand">procceed</v-btn>
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
            new: [v=>v && !!v.trim()||'Brand Name is required'],
            edit: [v=>v && !!v.trim()||'Brand Name is required']
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
            { text: 'Brand Name', value: 'name' },
            { text: 'Actions', value: 'actions' },
        ],
        tblItems: [],
    }),
    props: ['show'],
    computed: {
        ...mapGetters(['brandData', 'brandPostData', 'brandDeleteData', 'brandPutData']),
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
        brandDeleteData(newVal) {
            if (newVal.STATUS === 200) {
                // this.removeBrandItem()
                this.brands()
            }
            this.loading = false
        },
        async show() {
            await this.getCsrfToken()
            this.brands()
        }
    },
    methods: {
        ...mapActions(['getCsrfToken', 'brands', 'brandPost', 'brandDelete', 'brandPut']),
        newBrand() {
            if (this.$refs.newBrand.validate()) {
                this.loading = true
                this.brandPost(this.newItem)
                this.action.new = false
            }
        },
        editBrand() {
            if (this.$refs.editBrand.validate()) {
                this.loading = true
                this.brandPut(this.newItem)
                this.action.edit = false
            }
        },
        deleteBrand() {
            this.loading = true
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

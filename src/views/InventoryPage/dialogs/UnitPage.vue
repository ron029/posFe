<template>
    <v-dialog
        v-model="showDialog"
        width="400px"
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
                        <v-toolbar-title>Units</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn @click="newUnitItem()" color="success"><v-icon>mdi-plus</v-icon>New</v-btn>
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
                ref="editUnit"
                @submit.prevent="editUnit()"
                v-model="valid.edit"
            >
                <v-card>
                    <v-card-title>Edit: {{ this.currentItem?.name }}</v-card-title>
                    <v-card-text>
                        <v-text-field
                            label="Unit Name"
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
        <v-dialog
            v-model="showDialogNew"
            width="400px"
        >
            <v-form
                ref="newUnit"
                @submit.prevent="newUnit()"
                v-model="valid.new"
            >
                <v-card>
                    <v-card-title>New Units</v-card-title>
                    <v-card-text>
                        <v-text-field
                            v-model="newItem.name"
                            label="Unit Name"
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
                <v-card-title color="error">Delete Unit named {{ this.currentItem?.name }}?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="showDialogDelete=false">cancel</v-btn>
                    <v-btn color="error" @click="deleteUnit">procceed</v-btn>
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
            new: [v=>v && !!v.trim()||'Unit Name is required'],
            edit: [v=>v && !!v.trim()||'Unit Name is required']
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
            { text: 'Unit Name', value: 'name' },
            { text: 'Actions', value: 'actions' },
        ],
        tblItems: [],
    }),
    props: ['show'],
    computed: {
        ...mapGetters(['unitData', 'unitPostData', 'unitDeleteData', 'unitPutData']),
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.$emit('hideUnit')
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
        unitPostData(newVal) {
            if (newVal.STATUS === 200) {
                // this.newItem.unit_id = newVal.DATA.insertId
                // this.createUnitItem()
                this.units()
            }
            this.loading = false
        },
        unitData(newVal) {
            if (newVal.STATUS === 200) {
                this.tblItems = newVal.DATA
            }
            this.loading = false
        },
        unitPutData(newVal) {
            if (newVal.STATUS === 200) {
                // this.updateUnitItems()
                this.units()
            }
            this.loading = false
        },
        unitDeleteData(newVal) {
            if (newVal.STATUS === 200) {
                // this.removeUnitItem()
                this.units()
            }
            this.loading = false
        },
        async show() {
            await this.getCsrfToken()
            this.units()
        }
    },
    methods: {
        ...mapActions(['getCsrfToken', 'units', 'unitPost', 'unitDelete', 'unitPut']),
        newUnit() {
            if (this.$refs.newUnit.validate()) {
                this.loading = true
                this.unitPost(this.newItem)
                this.action.new = false
            }
        },
        editUnit() {
            if (this.$refs.editUnit.validate()) {
                this.loading = true
                this.unitPut(this.newItem)
                this.action.edit = false
            }
        },
        deleteUnit() {
            this.loading = true
            this.unitDelete({unit_id: this.currentItem.unit_id})
            this.action.delete = false
        },
        newUnitItem() {
            this.newItem = {name: '', unit_id: null}
            this.$refs?.newUnit?.reset()
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
        createUnitItem() {
            this.tblItems.unshift(this.newItem);
        },
        updateUnitItems() {
            const index = this.tblItems.findIndex(
                (item) => item.unit_id === this.newItem.unit_id
            );

            if (index !== -1) {
                // Update the matched object with the newItem
                this.tblItems.splice(index, 1, this.newItem);
            } else {
                console.warn("No matching unit_id found in tblItems");
            }
        },
        removeUnitItem() {
            const index = this.tblItems.findIndex(
                (item) => item.unit_id === this.newItem.unit_id
            );

            if (index !== -1) {
                // Remove the matched object
                this.tblItems.splice(index, 1);
            } else {
                console.warn("No matching unit_id found in tblItems");
            }
        }
    },
}
</script>

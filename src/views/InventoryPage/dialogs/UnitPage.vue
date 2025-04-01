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
                        <v-toolbar-title>Units</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn @click="newUnitItem()" :disabled="!isUserCanCreateUnits" color="success"><v-icon>mdi-plus</v-icon>New</v-btn>
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
                    <v-icon @click="editItem(item)" :disabled="!isUserCanUpdateUnits" color="warning">mdi-pencil</v-icon>
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
                            :rules="[v=>v && !!v.trim()||'Unit Name is required']"
                            clearable
                        ></v-text-field>
                        <v-text-field
                            label="Abbr"
                            v-model="newItem.name"
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
                            :rules="[v=>v && !!v.trim()||'Unit Name is required']"
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
                <v-card-title color="error">Delete Unit named {{ this.currentItem?.name }}?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="showDialogDelete=false">cancel</v-btn>
                    <v-btn disabled color="success" @click="deleteUnit">proceed</v-btn>
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
            name: null
        },
        headers: [
            { text: 'Unit Name', value: 'name' },
            { text: 'Abbr', value: 'abbr' },
            { text: 'Actions', value: 'actions' },
        ],
        tblItems: [],
    }),
    props: ['show'],
    computed: {
        ...mapGetters(['unitData', 'unitPostData', 'unitDeleteData', 'unitPutData', 'findUserRolePermissionData']),
        isUserCanReadUnits() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'unit:1')
            return false
        },
        isUserCanCreateUnits() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'unit:0')
            return false
        },
        isUserCanUpdateUnits() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'unit:2')
            return false
        },
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
            } else {
                console.error(newVal.STATE)
            }
            this.loading = false
        },
        unitData(newVal) {
            if (newVal.STATUS === 200) {
                this.tblItems = newVal.DATA
            } else {
                console.error(newVal.STATE)
            }
            this.loading = false
        },
        unitPutData(newVal) {
            if (newVal.STATUS === 200) {
                // this.updateUnitItems()
                this.units()
            } else {
                console.error(newVal.STATE)
            }
            this.loading = false
        },
        async unitDeleteData(newVal) {
            if (newVal.STATUS === 200) {
                // this.removeUnitItem()
                await this.getCsrfToken()
                this.units()
            } else {
                console.error(newVal.STATE)
            }
            this.loading = false
        },
        async show() {
            await this.getCsrfToken()
            if (this.isUserCanReadUnits)
                this.units()
        }
    },
    methods: {
        ...mapActions(['getCsrfToken', 'units', 'unitPost', 'unitDelete', 'unitPut']),
        async newUnit() {
            if (this.$refs.newUnit.validate()) {
                this.loading = true
                await this.getCsrfToken()
                this.unitPost(this.newItem)
                this.action.new = false
            }
        },
        async editUnit() {
            if (this.$refs.editUnit.validate()) {
                this.loading = true
                await this.getCsrfToken()
                this.unitPut(this.newItem)
                this.action.edit = false
            }
        },
        async deleteUnit() {
            this.loading = true
            await this.getCsrfToken()
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

<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-data-table
        v-if="showTbl"
        :headers="headers"
        :items="tblItems"
        :single-expand="singleExpand"
        item-key="name"
        show-expand
        :expanded.sync="expanded"
    >
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Manage Roles</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-switch
                    v-model="singleExpand"
                    label="Single expand"
                    class="mt-2"
                ></v-switch>
            </v-toolbar>
        </template>
        <template v-slot:name="{ item }">
            <p>{{ item.name }}
                <v-btn icon color="orange"><v-icon>mdi-pencil</v-icon></v-btn>
            </p>
        </template>
        <template v-slot:expanded-item="{ item }">
            <td :colspan="headers.length">
                <div v-for="(group, actionKey) in groupedPermissions(item.permissions)" :key="actionKey" style="width: 150px; display: inline-block; padding: 10px 20px ; vertical-align: top;">
                    <p>{{ actionKey }}</p>
                    <v-checkbox
                        v-for="(permissionItem, index) in group"
                        :key="index"
                        dense
                        v-model="permissionItem.value"
                        :label="permissionItem.action[1]"
                    ></v-checkbox>
                </div>
            </td>
        </template>
        <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
            <v-btn @click="expand(true), expandFunc(item)" icon v-if="!isExpanded"><v-icon>mdi-chevron-up</v-icon></v-btn>
            <v-btn @click="expand(false), expandFunc(item)" icon v-if="isExpanded"><v-icon>mdi-chevron-down</v-icon></v-btn>
        </template>
    </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data: ()=>({
        tblItems: [],
        expanded: [],
        singleExpand: false,
        permissionLoad: false,
        permissionList: []
    }),
    props: ['show', 'headers', 'items'],
    computed: {
        ...mapGetters(['permissionData']),
        showTbl() {
            if (this.permissionData && this.permissionData.DATA)
                this.setTbl()
            return this.show
        },

    },
    watch: {
        tblItems(newVal) {
            console.log('watch tblItems newVal: ', newVal)
        },
        // permissionData(newVal) {
        //     for (let i=0; i<this.tblItems.length; i++) {
        //         this.tblItems[i] = {...this.tblItems[i], permissions: newVal.DATA.map(item => ({permission_id: item.permission_id, name: item.name, action: item.name.split(':'), value: false}))}
        //     }
        // },
        show(newVal) {
            if (newVal && !this.permissionLoad)
                this.permission()
        }
    },
    methods: {
        ...mapActions(['permission']),
        setTbl() {
            this.tblItems = this.items
            if (this.permissionData) {
                for (let i=0; i<this.tblItems.length; i++) {
                    this.tblItems[i] = {...this.tblItems[i], permissions: this.permissionData.DATA.map(item => ({permission_id: item.permission_id, name: item.name, action: item.name.split(':'), value: false}))}
                }
            }
        },
        groupedPermissions(permission) {
            return permission.reduce((groups, item) => {
                const actionKey = item.action[0]; // Group by action[0]
                if (!groups[actionKey]) {
                    groups[actionKey] = [];
                }
                groups[actionKey].push(item);
                return groups;
            }, {});
        },
        expandFunc(item) {
            console.log('expand: ', item)
        },
    }
}
</script>

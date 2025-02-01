<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-data-table
        v-if="showTbl"
        :headers="headers"
        :items="tblItems"
        item-key="name"
        :item-class="() => 'rowClass'"
        show-expand
        :single-expand="singleExpand"
        :expanded.sync="expanded"
    >
        <!-- <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Manage Roles</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-switch
                    v-model="singleExpand"
                    label="Single expand"
                    class="mt-2"
                ></v-switch>
            </v-toolbar>
        </template> -->
        <template v-slot:item.name="{ item, index }">
            <v-hover v-slot="{ hover }" close-delay="200">
                <p style="margin: 0 auto; vertical-align: middle; height: 40px;" :id="'topMostElement' + index">
                    <span style="margin-top: 20px;">{{ item.name }}</span><span style="font-size: 20px;">&nbsp;</span>
                    <v-btn
                        :style="'background-color: orange; color: white; vertical-align: middle;'"
                        small
                        v-show="hover && item.edit"
                        @click="triggerEdit(item, 'edit', index), $vuetify.goTo('#topMostElement' + index, goToOptions)"
                    ><v-icon style="margin" small>mdi-pencil</v-icon> edit</v-btn>
                    <v-btn
                        :style="'background-color: red; color: white; vertical-align: middle;'"
                        small
                        v-show="hover && !item.edit"
                        @click="triggerEdit(item, 'close', index)"
                    ><v-icon style="margin" small>mdi-close</v-icon> cancel edit</v-btn>
                    <v-btn
                        :style="'background-color: green; color: white; vertical-align: middle;'"
                        small
                        v-show="hover && !item.edit && item.hasChangePermission"
                        @click="updateRole(item)"
                    ><v-icon style="margin" small>mdi-content-save</v-icon> save changes
                    </v-btn>
                </p>
            </v-hover>
        </template>
        <template v-slot:expanded-item="{ item }">
            <td :colspan="headers.length">
                <div v-for="(group, actionKey) in groupedPermissions(item.permissions)" :key="actionKey" :style="'width: 150px; display: inline-block; padding: 10px 20px; vertical-align: top;'">
                    <p>{{ actionKey }}</p>
                    <v-checkbox
                        v-for="(permissionItem, index) in group"
                        :key="index"
                        dense
                        v-model="permissionItem.value"
                        :label="permissionItem.action[1]"
                        :disabled="item.edit"
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
import util from './../../utils';
import { mapActions, mapGetters } from 'vuex';

export default {
    data: ()=>({
        onEdit: {
            status: false,
        },
        isRoleChange: false,
        hoveredRow: null,
        tblItems: [],
        originalItem: null,
        expanded: [],
        singleExpand: true,
        permissionLoad: false,
        permissionList: [],
        goToOptions: {
            duration: 1000,
            offset: 0,
            easing: 'easeInOutCubic',
        },
    }),
    props: ['show', 'headers', 'items'],
    computed: {
        ...mapGetters(['permissionData']),
        showTbl() {
            if (this.permissionData && this.permissionData.DATA)
                this.setTbl()
            return this.show
        }
    },
    watch: {
        expanded: {
            handler(newVal) {
                if (newVal) {
                    for (let i=0; i<newVal.length; i++) {
                        for (let j=0; j<this.originalItem.length; j++) {
                            if (newVal[i].name === this.originalItem[j].name) {
                                const isPermissionChange = !util.deepEqual(newVal[i].permissions, this.originalItem[j].permissions)
                                const currentPosition = this.tblItems.findIndex(item => item.name === newVal[i].name)
                                if (currentPosition !== -1)
                                    this.tblItems[currentPosition].hasChangePermission = isPermissionChange
                            }
                        }
                    }
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        ...mapActions(['role', 'permission']),
        updateRole(item) {
            console.log('updateRole item: ', item)
        },
        triggerEdit(item, action, currentPosition) {
            const index = this.expanded.indexOf(item);
            if (index === -1) {
                this.expanded = []
                this.expanded.push(item);
            }

            this.onEdit.status = action === 'edit'

            if (action === 'close') {
                this.role()
                this.expanded = []
                this.expanded.push(this.tblItems[currentPosition])
            }

            return item.edit = action === 'close'
        },
        handleMouseOver(event) {
            if (event && event.item && event.item.name) {
                this.hoveredRow = event.item.name;
            }
        },
        setTbl() {
            let rolesWithPermission = structuredClone(this.items)

            let newItem = []
            if (this.permissionData) {
                const keys = Object.keys(rolesWithPermission)
                for (let i=0; i<keys.length; i++) {
                    rolesWithPermission[keys[i]] = {permissions: this.permissionData.DATA.map(item => ({permission_id: item.permission_id, name: item.name, action: item.name.split(':'), value: rolesWithPermission[keys[i]].some(roleItem => roleItem.permission_id == item.permission_id)}))}
                    newItem[newItem.length] =  {name: keys[i], ...rolesWithPermission[keys[i]], edit: true, hasChangePermission: false}
                }
            }
            this.tblItems = newItem
            if (this.originalItem === null)
                this.originalItem = structuredClone(this.tblItems)
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
    },
    mounted() {
        this.role()
        this.permission()
    }
}
</script>

<style scoped>
.rowClass {
    height: 5px;
}
</style>

<template>
    <div style="margin: 0 20px">
        <h1>Staff</h1>
        <v-card style="padding: 10px; margin-bottom: 10px;">
            <v-btn
                style="margin-right: 5px;"
                @click="displayPageFunc('staff')"
                :color="displayPage.staff ? 'primary' : ''"
            ><v-icon>mdi-account</v-icon>accounts</v-btn>
            <v-btn
                style="margin-right: 5px;"
                @click="displayPageFunc('role')"
                :color="displayPage.role ? 'primary' : ''"
            ><v-icon>mdi-account-multiple</v-icon>roles</v-btn>
            <v-btn
                style="margin-right: 5px;"
                @click="displayPageFunc('audit')"
                :color="displayPage.audit ? 'primary' : ''"
            ><v-icon>mdi-clipboard-text-clock</v-icon>audit logs</v-btn>
            <v-btn
                v-if="displayPage.staff"
                absolute
                right
                @click="show.newStaff=true"
                color="success"
                :disabled="isUserCanCreateEmployee"
            ><v-icon>mdi-account-plus</v-icon>&nbsp;New</v-btn>
            <v-btn
                v-if="displayPage.role"
                absolute
                right
                @click="show.role=true"
                color="success"
                :disabled="isUserCanReadRole"
            ><v-icon>mdi-account-multiple-plus</v-icon>&nbsp;New</v-btn>
        </v-card>
        <v-card>
            <tblStaff
                :show="displayPage.staff"
                :headers="headers.staff"
                :items="items.staff"
                @editAccount="editAccount"
                @editPassword="editPassword"
            />
            <tblRole
                :show="displayPage.role"
                :headers="headers.role"
                :items="items.role"
                @reloadRolePermission="reloadRolePermission"
            />
            <tblAudit
                :show="displayPage.audit"
                :headers="headers.audit"
                :items="items.audit"
            />
        </v-card>
        <EditStaff
            v-if="show.edit.staffInfo.value"
            :show="show.edit.staffInfo.value"
            @closeDialog="closeEditStaffInfo"
        />
        <EditPassword
            v-if="show.edit.staffPassword.value"
            :show="show.edit.staffPassword.value"
            @closeDialog="closeEditStaffPassword"
        />
        <NewStaff
            :show="show.newStaff"
            @closeDialog="show.newStaff=false"
        />
        <NewRole
            :show="show.role"
            @closeDialog="closeRoleDialog"
        />
    </div>
</template>

<script>
import tblAudit from './tblAudit.vue';
import tblRole from './tblRole.vue';
import tblStaff from './tblStaff.vue';
import EditStaff from './EditStaff.vue';
import EditPassword from './EditPassword.vue';
import NewStaff from './NewStaff.vue';
import NewRole from './NewRole.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
    components: { tblAudit, tblRole, tblStaff, EditStaff, NewRole, NewStaff, EditPassword },
    data: () => ({
        isAdmin: window.$cookies.get("admin") === '1',
        expanded: [],
        lastExpanded: null,
        singleExpand: false,
        displayPage: {
            staff: true,
            role: false,
            audit: false,
        },
        show: {
            newStaff: false,
            role: false,
            edit: {
                staffInfo: {
                    value: false,
                    status: false
                },
                staffPassword: {
                    value: false,
                    status: false
                }
            }
        },
        headers: {
            staff: [
                {text: 'Username', value: 'username'},
                {text: 'Name', value: 'name'},
                {text: 'Birthday', value: 'birthdate'},
                {text: 'Address', value: 'address'},
                {text: 'Emergency Contact', value: 'emergency_contact'},
                {text: 'Emergency Name', value: 'emergency_name'},
                {text: 'Status', value: 'is_active'},
                {text: 'Role', value: 'role'},
                {text: 'Actions', value: 'actions'},
            ],
            role: [
                {text: 'Name', value: 'name'},
                {text: '', value: 'data-table-expand'},
            ],
            audit: [
                {text: 'Name', value: 'employee_id'},
                {text: 'Action', value: 'action'},
                {text: 'Description', value: 'details'},
                {text: 'Permission', value: 'details.permission'},
                {text: 'Timestamp', value: 'created_at'}
            ]
        },
        items: {
            staff: [],
            role: [],
            audit: [],
        },
    }),
    computed: {
        ...mapGetters(['employeeData', 'employeePostData', 'employeeFindData', 'roleData', 'permissionData', 'loggerData', 'findUserRolePermissionData']),
        isUserCanCreateEmployee() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'employee:0')
            return false
        },
        isUserCanReadEmployee() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'employee:1')
            return false
        },
        isUserCanReadRole() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'role:1')
            return false
        },
        isUserCanReadLogs() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'logs:1')
            return false
        },
    },
    watch: {
        loggerData(newVal) {
            if (newVal.STATUS === 200) {
                this.items.audit = newVal.DATA
            } else {
                console.log(newVal.STATE)
            }
            console.log('watch loggerData newVal: ', newVal)
        },
        roleData(newVal) {
            if (newVal.STATUS === 200) {
                this.reloadRolePermission(newVal.DATA)
            } else {
                console.error(newVal.STATE)
            }
        },
        employeeFindData(newVal) {
            if (newVal.STATUS === 200) {
                if (this.show.edit.staffInfo.status)
                    this.show.edit.staffInfo.value = true
                if (this.show.edit.staffPassword.status)
                    this.show.edit.staffPassword.value = true
            } else {
                console.error(newVal.STATE)
            }
        },
        employeeData(newVal) {
            if (newVal) {
                this.items.staff = structuredClone(newVal.DATA)
                if (!this.isAdmin) {
                    this.items.staff = this.items.staff?.filter(item => item.is_admin !== 1)
                }
            }
        }
    },
    methods: {
        ...mapActions(['employee', 'employeeFind', 'userRole', 'logger']),
        closeEditStaffPassword() {
            this.show.edit.staffPassword = {
                value: false,
                status: false
            }
        },
        closeEditStaffInfo() {
            this.show.edit.staffInfo = {
                value: false,
                status: false
            }
        },
        closeRoleDialog() {
            this.show.role=false
            this.userRole()
        },
        reloadRolePermission(data) {
            const test = this.groupedRolesAndPermissions(data)
            this.items.role = test
            if (!this.isAdmin) {
                delete this.items.role.admin
            }
        },
        groupedRolesAndPermissions(roleAndPermissions) {
            return roleAndPermissions.reduce((groups, item) => {
                const role = item.role_name;
                if (!groups[role]) {
                    groups[role] = [];
                }
                groups[role].push(item);
                return groups;
            }, {});
        },
        displayPageFunc(page) {
            this.displayPage.staff = page === 'staff'
            this.displayPage.role = page === 'role'
            this.displayPage.audit = page === 'audit'
        },
        editAccount(employee_id) {
            this.show.edit.staffInfo.status = true
            this.employeeFind(employee_id)
        },
        editPassword(employee_id) {
            this.show.edit.staffPassword.status = true
            this.employeeFind(employee_id)
        }
    },
    mounted() {
        if (this.isUserCanReadEmployee)
            this.employee()
        if (this.isUserCanReadRole)
            this.userRole()
        if (this.isUserCanReadLogs)
            this.logger()
    }
}
</script>

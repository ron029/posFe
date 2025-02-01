<template>
    <div style="margin: 0 20px">
        <h1>STAFF</h1>
        <p>
            <v-btn
                @click="displayPageFunc('staff')"
                :color="displayPage.staff ? 'primary' : ''"
            ><v-icon>mdi-account</v-icon>accounts</v-btn>
            <v-btn
                @click="displayPageFunc('role')"
                :color="displayPage.role ? 'primary' : ''"
            ><v-icon>mdi-account-multiple</v-icon>roles</v-btn>
            <v-btn
                v-if="displayPage.staff"
                absolute
                right
                @click="show.newStaff=true"
                color="success"
            ><v-icon>mdi-account-plus</v-icon>&nbsp;New</v-btn>
            <v-btn
                v-if="displayPage.role"
                absolute
                right
                @click="show.role=true"
                color="success"
            ><v-icon>mdi-account-multiple-plus</v-icon>&nbsp;New</v-btn>
        </p>
        <v-card>
            <tblStaff
                :show="displayPage.staff"
                :headers="headers.staff"
                :items="items.staff"
                @editAccount="editAccount"
            />
            <tblRole
                :show="displayPage.role"
                :headers="headers.role"
                :items="items.role"
            />
        </v-card>
        <EditStaff
            v-if="show.edit.staff"
            :show="show.edit.staff"
            @closeDialog="show.edit.staff=false"
        />
        <NewStaff
            :show="show.newStaff"
            @closeDialog="show.newStaff=false"
        />
        <NewRole
            :show="show.role"
            @closeDialog="show.role=false"
        />
    </div>
</template>

<script>
import tblRole from './tblRole.vue';
import tblStaff from './tblStaff.vue';
import EditStaff from './EditStaff.vue';
import NewStaff from './NewStaff.vue';
import NewRole from './NewRole.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        tblRole,
        tblStaff,
        EditStaff,
        NewRole,
        NewStaff
    },
    data: () => ({
        expanded: [],
        lastExpanded: null,
        singleExpand: false,
        displayPage: {
            staff: true,
            role: false
        },
        show: {
            newStaff: false,
            role: false,
            edit: {
                staff: false
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
            ]
        },
        items: {
            staff: [],
            role: [],
        },
    }),
    computed: {
        ...mapGetters(['employeeData', 'employeePostData', 'employeeFindData', 'roleData', 'permissionData'])
    },
    watch: {
        roleData(newVal) {
            if (newVal.STATUS === 200) {
                const test = this.groupedRolesAndPermissions(newVal.DATA)
                console.log('watch roleData test: ', test)
                this.items.role = test
            }
        },
        employeeFindData(newVal) {
            if (newVal.STATUS === 200)
                this.show.edit.staff = true
        },
        employeeData(newVal) {
            console.log('employeeData newVal: ', newVal)
            if (newVal) this.items.staff = newVal.DATA
        }
    },
    methods: {
        ...mapActions(['employee', 'employeeFind', 'userRole']),
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
        },
        editAccount(employee_id) {
            this.employeeFind(employee_id)
        }
    },
    mounted() {
        this.employee()
        this.userRole()
    }
}
</script>

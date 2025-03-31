<template>
    <div style="padding: 0 20px 20px 20px">
        <h1>Manage Account</h1>
        <v-card>
            <v-card-title>Employee Info</v-card-title>
            <v-card-text>
                <v-text-field
                    outlined
                    v-if="userInfo.name"
                    :value="userInfo.name"
                    readonly
                    label="Name"
                ></v-text-field>
                <v-text-field
                    outlined
                    v-if="userInfo.address"
                    :value="userInfo.address"
                    readonly
                    label="Address"
                ></v-text-field>
                <v-text-field
                    outlined
                    v-if="userInfo.birthdate"
                    :value="userInfo.birthdate"
                    readonly
                    type="date"
                    label="Birthdate"
                ></v-text-field>
                <v-text-field
                    outlined
                    v-if="userInfo.age"
                    :value="`${userInfo.age} years old`"
                    readonly
                    label="Birthdate"
                ></v-text-field>
                <v-text-field
                    outlined
                    v-if="userInfo.emergency_name"
                    :value="userInfo.emergency_name"
                    readonly
                    label="Emergency Contact Person"
                ></v-text-field>
                <v-text-field
                    outlined
                    v-if="userInfo.emergency_contact"
                    :value="userInfo.emergency_contact"
                    readonly
                    label="Emergency Contact Number"
                ></v-text-field>
            </v-card-text>
        </v-card>
        <v-card style="margin-top: 10px;">
            <v-card-title>Account Info <v-spacer></v-spacer>
                <v-btn
                    :disabled="!isUserCanUpdatePassword"
                    @click="showChangePass = true"
                >Change Password</v-btn></v-card-title>
            <v-card-text>
                <v-text-field
                    outlined
                    v-if="userInfo.username"
                    :value="userInfo.username"
                    readonly
                    label="Username"
                ></v-text-field>
                <v-text-field
                    outlined
                    :value="1234567890"
                    readonly
                    type="password"
                    label="Password"
                ></v-text-field>
            </v-card-text>
        </v-card>
        <ChangePassDialog
            v-if="showChangePass"
            :showChangePass="showChangePass"
            @closeDialog="showChangePass = false"
        />
    </div>
</template>

<script>
import ChangePassDialog from './ChangePassDialog.vue';
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        ChangePassDialog
    },
    data: ()=>({
        showChangePass: false,
        userInfo: {
            "address": null,
            "age": null,
            "birthdate": null,
            "emergency_contact": null,
            "emergency_name": null,
            "name": null,
            "username": null
        }
    }),
    computed: {
        ...mapGetters(['employeeFindData', 'findUserRolePermissionData', 'changePasswordData']),
        isUserCanUpdatePassword() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'self_pass:2')
            return false
        },
    },
    watch: {
        employeeFindData(newVal) {
            this.userInfo = newVal.DATA[0]
            this.userInfo.birthdate = moment(this.userInfo.birthdate).utcOffset('+0800').format('YYYY-MM-DD')
            this.userInfo.age = moment().diff(moment(newVal.DATA[0].birthdate).utcOffset('+0800').startOf('day'), 'years');
        }
    },
    methods: {
        ...mapActions(['getCsrfToken', 'employeeFind']),
    },
    async mounted() {
        await this.getCsrfToken()
        const userId = window.$cookies.get('userId')
        this.employeeFind(Number(userId))
    }
}
</script>

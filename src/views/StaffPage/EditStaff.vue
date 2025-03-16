<template>
    <v-dialog
        width="400"
        v-model="showDialog"
    >
        <v-card>
            <v-form
                v-model="valid"
                ref="form"
                @submit.prevent="submitForm"
            >
                <v-card-title style="background-color: blue; color: white">Edit Staff: ({{ employeeFindData.DATA[0].name }})</v-card-title>
                <v-card-text>
                    <v-select
                        v-model="user.role_id"
                        :items="userRoleData && userRoleData.DATA"
                        label="Role"
                        item-text="name"
                        item-value="role_id"
                        :rules="rules.role"
                    ></v-select>
                    <v-text-field
                        v-model="user.username"
                        label="Username"
                        :rules="rules.username"
                    ></v-text-field>
                    <!-- <v-text-field
                        v-model="user.password"
                        label="Password"
                        :rules="rules.password"
                    ></v-text-field>
                    <v-text-field
                        v-model="user.confirm_password"
                        label="Confirm Password"
                        :rules="(rules.confirm_password).concat([user.password===user.confirm_password||'Password does not match'])"
                    ></v-text-field> -->
                    <v-text-field
                        v-model="user.name"
                        label="Name"
                        :rules="rules.name"
                    ></v-text-field>
                    <v-text-field
                        v-model="user.birthdate"
                        label="Birthdate"
                        type="date"
                    ></v-text-field>
                    <v-text-field
                        v-model="user.address"
                        label="Address"
                    ></v-text-field>
                    <v-text-field
                        v-model="user.emergency_contact"
                        label="Emergency Contact"
                    ></v-text-field>
                    <v-text-field
                        v-model="user.emergency_name"
                        label="Emergency Name"
                    ></v-text-field>
                    <v-select
                        :items="[{status: 'Active', value: 1}, {status: 'Inactive', value: 0}]"
                        v-model="user.is_active"
                        item-text="status"
                        item-value="value"
                        label="Status"
                    ></v-select>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="danger" @click="showDialog=false">cancel</v-btn>
                    <v-btn type="submit" color="success">submit</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';

export default {
    props: ['show'],
    data: () => ({
        valid: true,
        user: {
            employee_id: null,
            username: null,
            password: null,
            name: null,
            age: null,
            birthdate: null,
            address: null,
            emergency_contact: null,
            emergency_name: null,
            isAdmin: null,
            role_id: null,
            is_active: null,
        },
        rules: {
            username: [v=>!!v||"Username is required"],
            password: [v=>!!v||"Password is required"],
            confirm_password: [v=>!!v||"Confirm Password is required"],
            name: [v=>!!v||"Name is required"],
            role: [v=>!!v||"Role is required"],
        }
    }),
    computed: {
        ...mapGetters(['signUpData', 'employeeFindData', 'employeePutData', 'userRoleData']),
        showDialog: {
            get() {
                this.setForm()
                return this.show
            },
            set() {
                this.$emit('closeDialog')
            }
        }
    },
    watch: {
        employeeFindData(newVal) {
            console.log('employeeFindData newVal: ', newVal)
            if (newVal.STATUS === 200) {
                this.user = structuredClone(newVal.DATA[0])
                this.user.birthdate = this.user.birthdate !== null
                    ? moment(this.user.birthdate).format('YYYY-MM-DD')
                    : null
            }
        },
        'user.birthdate'(newVal) {
            console.log('watch user.birthdate newVal: ', newVal)
        },
        employeePutData(newVal) {
            if (newVal.STATUS === 200) {
                this.employee()
                this.showDialog = false
            } else if (newVal.STATUS === 409) {
                alert(newVal.STATE)
            }
        },
        signUpData(newVal) {
            console.log('signUpData newVal: ', newVal)
            if (newVal.STATUS===201) {
                this.employee()
                this.showDialog = false
            } else {
                alert(newVal.STATE)
            }
        }
    },
    methods: {
        ...mapActions(['signUp', 'employee', 'employeePut']),
        setForm() {
            if (this.employeeFindData.STATUS === 200) {
                this.user = structuredClone(this.employeeFindData.DATA[0])
                console.log('this.user: ', this.user)
                this.user.birthdate = moment(this.user.birthdate).format('YYYY-MM-DD')
                delete this.user.created_at
                delete this.user.updated_at
            }
        },
        submitForm() {
            if (this.$refs.form.validate()) {
                this.user.birthdate = moment(this.user.birthdate).format('YYYY-MM-DD')
                console.log('form submitted')
                this.employeePut(this.user)
            }
        }
    }
}
</script>

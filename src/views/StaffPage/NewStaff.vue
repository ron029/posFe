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
                <v-card-title style="background-color: blue; color: white">New Staff</v-card-title>
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
                    <v-text-field
                        v-model="user.password"
                        label="Password"
                        :rules="rules.password"
                    ></v-text-field>
                    <v-text-field
                        v-model="user.confirm_password"
                        label="Confirm Password"
                        :rules="(rules.confirm_password).concat([user.password===user.confirm_password||'Password does not match'])"
                    ></v-text-field>
                    <v-text-field
                        v-model="user.name"
                        label="Name"
                        :rules="rules.name"
                    ></v-text-field>
                    <v-text-field
                        v-model="user.birthdate"
                        label="Birthdate"
                        type="date"
                        :rules="[v=>!!v||'Birthdate is required']"
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
import { mapActions, mapGetters } from 'vuex';

export default {
    props: ['show'],
    data: () => ({
        valid: true,
        user: {
            username: null,
            password: null,
            name: null,
            age: null,
            birthdate: null,
            address: null,
            emergency_contact: null,
            emergency_name: null,
            role_id: null,
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
        ...mapGetters(['signUpData', 'userRoleData']),
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.$refs.form.reset()
                this.$emit('closeDialog')
            }
        }
    },
    watch: {
        userRoleData(newVal) {
            console.log('watch userRoleData newVal: ', newVal)
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
        ...mapActions(['signUp', 'employee']),
        submitForm() {
            if (this.$refs.form.validate()) {
                console.log('form submitted')
                this.signUp(this.user)
            }
        }
    }
}
</script>

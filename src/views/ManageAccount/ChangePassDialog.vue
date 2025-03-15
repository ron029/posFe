<template>
    <v-dialog
        v-model="showDialog"
        width="600"
    >
        <v-card>
            <v-form
                ref="form"
                v-model="valid"
                @submit.prevent="submitForm"
            >
                <v-card-title>
                    Change Password
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        outlined
                        v-model.trim="password.old.value"
                        label="Old Password"
                        :type="password.old.show ? 'text' : 'password'"
                        :append-icon="password.old.show ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="password.old.show = !password.old.show"
                        :rules="[v=>!!v||'Old Password is required']"
                        clearable
                    ></v-text-field>
                    <v-text-field
                        clearable
                        outlined
                        v-model.trim="password.new.value"
                        label="New Password"
                        :rules="[v=>!!v||'New Password is required', v=>v && v.length >= 8 || 'Password must be at least 8 characters long.']"
                        :type="password.new.show ? 'text' : 'password'"
                        :append-icon="password.new.show ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="password.new.show = !password.new.show"
                    ></v-text-field>
                    <v-text-field
                        clearable
                        outlined
                        v-model.trim="password.retype.value"
                        label="Retype Password"
                        :rules="[v=>!!v||'Retype Password is required', password.new.value === password.retype.value || 'Password must match']"
                        :type="password.retype.show ? 'text' : 'password'"
                        :append-icon="password.retype.show ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="password.retype.show = !password.retype.show"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="showDialog = false" color="error">Close</v-btn>
                    <v-btn type="submit" color="success">Submit</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data: ()=>({
        password: {
            old: {
                show: false,
                value: null
            },
            new: {
                show: false,
                value: null
            },
            retype: {
                show: false,
                value: null,
            },
        },
        valid: false
    }),
    props: ['showChangePass'],
    computed: {
        ...mapGetters(['changePasswordData']),
        showDialog: {
            get() {
                return this.showChangePass
            },
            set() {
                this.$emit('closeDialog')
            }
        }
    },
    watch: {
        changePassword(newVal) {
            console.log('changePassword newVal: ', newVal)
        }
    },
    methods: {
        submitForm() {
            if (this.$refs && this.$refs.form && this.$refs.form.validate()) {
                console.log('fire change password')
            }
        }
    }
}
</script>

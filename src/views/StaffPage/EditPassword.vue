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
                <v-card-title style="background-color: blue; color: white">Update password: ({{ employeeFindData.DATA[0].name }})</v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="pass.old.value"
                        label="Old password"
                        :rules="[v=>!!v||'Old password is required']"
                        clearable
                        :type="pass.old.show ? 'text' : 'password'"
                        :append-icon="pass.old.show ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="pass.old.show = !pass.old.show"
                    ></v-text-field>
                    <v-text-field
                        v-model="pass.new.value"
                        label="New password"
                        :rules="[v=>!!v||'New password is required']"
                        clearable
                        :type="pass.new.show ? 'text' : 'password'"
                        :append-icon="pass.new.show ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="pass.new.show = !pass.new.show"
                    ></v-text-field>
                    <v-text-field
                        v-model="pass.retype.value"
                        label="Retype password"
                        :rules="[v=>!!v||'Retype password is required', pass.new.value === pass.retype.value || 'Password must match']"
                        clearable
                        :type="pass.retype.show ? 'text' : 'password'"
                        :append-icon="pass.retype.show ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="pass.retype.show = !pass.retype.show"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="$emit('closeDialog')">close</v-btn>
                    <v-btn color="success" type="submit">submit</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data: ()=>({
        valid: false,
        pass: {
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
        }
    }),
    props: ['show'],
    computed: {
        ...mapGetters(['employeeFindData', 'changePasswordStaffData']),
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.$emit('closeDialog')
            }
        }
    },
    watch: {
        changePasswordStaffData(newVal) {
            if (newVal.STATUS === 200) {
                alert('Password updated successfully')
                this.$emit('closeDialog')
            } else if (newVal.STATUS === 406) {
                alert(newVal.STATE)
            } else {
                console.error(newVal.STATE)
            }
        }
    },
    methods: {
        ...mapActions(['changePasswordStaff']),
        submitForm() {
            if (this.$refs && this.$refs.form && this.$refs.form.validate()) {
                const employee_id = this.employeeFindData.DATA[0].employee_id
                this.changePasswordStaff({employee_id, PASS_OLD: this.pass.old.value, PASS_NEW: this.pass.new.value})
            }
        }
    }
}
</script>

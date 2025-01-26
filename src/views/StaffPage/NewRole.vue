<template>
    <v-dialog
        width="800"
        v-model="showDialog"
    >
        <v-card>
            <v-form
                v-model="valid"
                ref="form"
                @submit.prevent="submitForm"
            >
                <v-card-title style="background-color: blue; color: white">New Role</v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="role.name"
                        label="Name"
                        :rules="rules.name"
                    ></v-text-field>
                    <div v-for="(group, actionKey) in groupedPermissions" :key="actionKey" style="width: 150px; display: inline-block; padding: 10px 20px ; vertical-align: top;">
                    <p>{{ actionKey }}</p>
                    <v-checkbox
                        v-for="(permissionItem, index) in group"
                        :key="index"
                        dense
                        v-model="permissionItem.value"
                        :label="permissionItem.action[1]"
                    ></v-checkbox>
                </div>
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
        role: {
            name: null
        },
        permissionList: [],
        rules: {
            name: [v=>!!v||"Name is required"],
        }
    }),
    computed: {
        ...mapGetters(['signUpData', 'permissionData']),
        groupedPermissions() {
            return this.permissionList.reduce((groups, item) => {
                const actionKey = item.action[0]; // Group by action[0]
                if (!groups[actionKey]) {
                    groups[actionKey] = [];
                }
                groups[actionKey].push(item);
                return groups;
            }, {});
        },
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
        permissionData(newVal) {
            this.permissionList = newVal.DATA.map(item => ({permission_id: item.permission_id, name: item.name, action: item.name.split(':'), value: false}))
            console.log('watch permissionData newVal: ', this.permissionList)
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
                // this.signUp(this.user)
            }
        }
    }
}
</script>

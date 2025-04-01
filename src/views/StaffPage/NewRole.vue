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
                        v-model.trim="userRole.name"
                        label="Name"
                        :rules="rules.name"
                        autocomplete="nope"
                    ></v-text-field>
                    <p class="text-right">
                        <v-btn v-if="!selectedAllPermission" @click="selectAllPermission()" small color="primary">select all</v-btn>
                        <v-btn v-else @click="deselectAllPermission()" small color="secondary">deselect all</v-btn>
                    </p>
                    <div v-for="(group, actionKey) in groupedPermissions(userRole.permissions)" :key="actionKey" style="width: 150px; display: inline-block; padding: 10px 20px ; vertical-align: top;">
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
        userRole: {
            name: null,
            permissions: [],
        },
        selectedAllPermission: false,
        permissionList: [],
        rules: {
            name: [v=>!!v||"Name is required"],
        }
    }),
    computed: {
        ...mapGetters(['signUpData', 'permissionData', 'roleData', 'rolePostData']),
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
        rolePostData(newVal) {
            if (newVal.STATUS === 409) {
                alert(newVal.STATE)
            } else {
                this.role()
                this.$emit('closeDialog')
            }
        },
        'userRole.permissions': {
            handler(newVal) {
                this.selectedAllPermission = newVal.every(item => item.value === true)
            },
            deep: true,
            immediate: true,
        },
        permissionData(newVal) {
            this.userRole.permissions = newVal.DATA.map(item => ({permission_id: item.permission_id, name: item.name, action: item.name.split(':'), value: false}))
        },
        signUpData(newVal) {
            if (newVal.STATUS===201) {
                this.employee()
                this.showDialog = false
            } else {
                alert(newVal.STATE)
            }
        }
    },
    methods: {
        ...mapActions(['signUp', 'employee', 'role', 'rolePost']),
        selectAllPermission() {
            this.selectedAllPermission = true
            this.userRole.permissions.forEach((item) => {
                item.value = true
            })
        },
        deselectAllPermission() {
            this.selectedAllPermission = false
            this.userRole.permissions.forEach((item) => {
                item.value = false
            })
        },
        groupedPermissions(permissions) {
            return permissions.reduce((groups, item) => {
                const actionKey = item.action[0]; // Group by action[0]
                if (!groups[actionKey]) {
                    groups[actionKey] = [];
                }
                groups[actionKey].push(item);
                return groups;
            }, {});
        },
        submitForm() {
            if (this.$refs.form.validate()) {
                this.rolePost(this.userRole)
            }
        }
    }
}
</script>

<template>
    <div style="padding: 0 20px">
        <h1>Company Page</h1>
        <v-card style="padding: 20px 40px;">
            <div v-if="company">
                <p class="text-right"><v-btn color="warning" @click="showEditCompany = true" :disabled="!isUserCanUpdateCompany"><v-icon small>mdi-pencil</v-icon>&nbsp;edit</v-btn></p>
                <v-text-field
                    outlined
                    v-model="company.name"
                    label="Company Name"
                    readonly
                ></v-text-field>
                <v-text-field
                    outlined
                    v-model="company.address1"
                    label="Address 1"
                    readonly
                ></v-text-field>
                <v-text-field
                    outlined
                    v-model="company.address2"
                    label="Address 2"
                    readonly
                ></v-text-field>
                <v-text-field
                    outlined
                    v-model="company.date_founded"
                    label="Date Founded"
                    readonly
                ></v-text-field>
                <v-textarea
                    outlined
                    v-model="company.description"
                    label="Description"
                    readonly
                ></v-textarea>
                <v-text-field
                    outlined
                    v-model="company.contact_number"
                    label="Contact Number"
                    readonly
                ></v-text-field>
                <v-text-field
                    outlined
                    v-model="company.updated_at"
                    label="Last Update"
                    readonly
                ></v-text-field>
            </div>
        </v-card>
        <EditCompanyDialog
            :showEditCompany="showEditCompany"
            :company="company"
            @hideEditCompany="showEditCompany = false"
        />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import EditCompanyDialog from './EditCompanyDialog.vue';
export default {
    data: ()=>({
        showEditCompany: false,
        company: {
            "company_info_id": 1,
            "name": "test",
            "address1": null,
            "address2": null,
            "date_founded": '2025-03-10',
            "description": null,
            "contact_number": null,
            "status": 0,
            "created_at": "2025-03-05T14:45:57.000Z",
            "updated_at": "2025-03-05T14:45:57.000Z"
        },
    }),
    components: {
        EditCompanyDialog
    },
    computed: {
        ...mapGetters(['companyProfilesData', 'findUserRolePermissionData']),
        isUserCanUpdateCompany() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'company:update')
            return false
        },
    },
    watch: {
        companyProfilesData(newVal) {
            this.company = structuredClone(newVal.DATA[0])
            this.company.updated_at = moment(this.company.updated_at).utcOffset('+0800').format('MMMM D, YYYY hh:mm A')
            this.company.date_founded = moment(this.company.date_founded).utcOffset('+0800').format('YYYY-MM-DD')
        }
    },
    methods: {
        ...mapActions(['companyProfiles']),
    },
    mounted() {
        this.companyProfiles()
    }
}
</script>

<template>
    <v-dialog
        v-model="showDialog"
        width="600px"
    >
        <v-card v-if="editCompany">
            <v-form
                v-model="valid"
                @submit.prevent="submitEditCompany"
            >
                <v-card-text style="padding: 20px 20px 0 20px">
                    <v-text-field
                        outlined
                        v-model="editCompany.name"
                        label="Company Name"
                    ></v-text-field>
                    <v-text-field
                        outlined
                        v-model="editCompany.address1"
                        label="Address 1"
                    ></v-text-field>
                    <v-text-field
                        outlined
                        v-model="editCompany.address2"
                        label="Address 2"
                    ></v-text-field>
                    <v-text-field
                        outlined
                        v-model="editCompany.date_founded"
                        label="Date Founded"
                        type="date"
                    ></v-text-field>
                    <v-textarea
                        outlined
                        v-model="editCompany.description"
                        label="Description"
                    ></v-textarea>
                    <v-text-field
                        outlined
                        v-model="editCompany.contact_number"
                        label="Contact Number"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer><v-btn type="submit">Submit</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    data: ()=>({
        valid: false,
        editCompany: null,
    }),
    props: ['showEditCompany', 'company'],
    computed: {
        ...mapGetters(['companyProfilesPutData']),
        showDialog: {
            get() {
                this.setEditCompany()
                return this.showEditCompany
            },
            set() {
                this.$emit('hideEditCompany')
            }
        }
    },
    watch: {
        companyProfilesPutData(newVal) {
            if (newVal.STATUS === 200) {
                this.companyProfiles()
                this.showDialog = false
            } else {
                console.error(newVal.STATE)
            }
        }
    },
    methods: {
        ...mapActions(['companyProfilesPut', 'companyProfiles']),
        submitEditCompany() {
            this.companyProfilesPut(this.editCompany)
        },
        setEditCompany() {
            this.editCompany = structuredClone(this.company)
            // this.editCompany.date_founded = this.editCompany.date_founded
        }
    }
}
</script>

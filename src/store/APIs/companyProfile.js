import API from "@/plugins/axios"

export default {
    companyProfiles() {
        return API.get('/company-profile/')
    },
    companyProfilesPut(args) {
        return API.put(`/company-profile/${args.company_info_id}`, args)
    },
};

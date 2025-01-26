import API from "@/plugins/axios"

export default {
    roleFind(data) {
        return API.get(`/role/${data}`)
    },
    rolePut(data) {
        return API.put(`/role/${data.role_id}`, data)
    },
    role() {
        return API.get('/role/')
    },
};

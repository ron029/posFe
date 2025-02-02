import API from "@/plugins/axios"

export default {
    roleFind(data) {
        return API.get(`/role/${data}`)
    },
    rolePut(data) {
        return API.put(`/role/${data.role_id}`, data)
    },
    rolePermissionPut(data) {
        return API.put(`/role/${data.role_id}/permissions`, data)
    },
    role() {
        return API.get('/role/')
    },
    userRole() {
        return API.get('/role/user-role')
    },
    rolePost(data) {
        return API.post('/role/', data)
    }
};

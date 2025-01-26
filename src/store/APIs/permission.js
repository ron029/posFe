import API from "@/plugins/axios"

export default {
    permissionFind(data) {
        return API.get(`/permission/${data}`)
    },
    permissionPut(data) {
        return API.put(`/permission/${data.permission_id}`, data)
    },
    permission() {
        return API.get('/permission/')
    },
};

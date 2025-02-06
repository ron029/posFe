import API from "@/plugins/axios"

export default {
    employeeFind(data) {
        return API.get(`/employee/${data}`)
    },
    employeePut(data) {
        return API.put(`/employee/${data.employee_id}`, data)
    },
    employee() {
        return API.get('/employee/')
    },
    findUserRolePermission(data) {
        return API.get(`/employee/${data.employee_id}/permissions`)
    }
};

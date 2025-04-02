import API from "@/plugins/axios"

export default {
    changePasswordSelf(params) {
        return API.post(`/auth/change-password/self/${params.employee_id}`, params)
    },
    changePasswordStaff(params) {
        return API.post(`/auth/change-password/staff/${params.employee_id}`, params)
    },
    signUp(params) {
        return API.post('/auth/signup', params)
    },
    logout() {
        return API.post('/auth/logout')
    },
    login(params) {
        return API.post('/auth/login', params)
    },
    getCsrfToken() {
        return API.get('/csrf/new');
    },
};

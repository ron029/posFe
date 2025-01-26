import API from "@/plugins/axios"

export default {
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

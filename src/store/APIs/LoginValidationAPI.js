import AXIOS from "../../../plugins/axios";

export default {

    validateLogin(userLoginCredentials) {
        return AXIOS.post(`/login/validateLogin`, userLoginCredentials);
    },
    verifyToken() {
        return AXIOS.get(`/login/verifyToken`);
    },
    userLogout() {
        return AXIOS.get(`/login/logout`);
    },
};

import AUTH_API from "../APIs/auth";
import AXIOS from "@/plugins/axios";

export const authentication = {
  state: {
    signUpData: null,
    isCashRegisterRecordedData: null,
    isUserTimeout: false,
    loginData: null,
  },
  actions: {
    signUp({commit}, params) {
        try {
            AUTH_API
            .signUp(params)
            .then(res => {
                commit('SIGNUP', res.data)
            })
        } catch (err) {
            commit('SIGNUP', err.response)
            console.error(err)
        }
    },
    login({commit}, params) {
        try {
            AUTH_API
            .login(params)
            .then(res => {
                commit('LOGIN', res.data)
            })
        } catch (err) {
            commit('LOGIN', err.response)
            console.error(err)
        }
    },
    async getCsrfToken() {
      try {
        const res = await AUTH_API.getCsrfToken();
        AXIOS.defaults.headers.common['X-CSRF-TOKEN'] = res.data.csrfToken;
        return AXIOS.defaults.headers;
      } catch (err) {
        console.error(err);
        throw err; // Rethrow the error to handle it in the caller function
      }
    },
    async logout() {
        try {
          await AUTH_API.logout();
            window.$cookies.remove("POS_AUTH")
            window.$cookies.remove("_csrf")
            window.$cookies.remove("admin")
            window.$cookies.remove("cash_register_is_set")
            window.$cookies.remove("cash_register_recorded")
            window.$cookies.remove("cash_register_recorded_id")
            window.$cookies.remove("login")
            window.$cookies.remove("name")
            window.$cookies.remove("timeIn")
            window.$cookies.remove("userId")
            location.reload()
        } catch (err) {
          console.error(err);
        }
      },
  },
  mutations: {
    SIGNUP(state, signUpData) {
        state.signUpData = signUpData
    },
    IS_CASH_REGISTER_RECORDED(state, isCashRegisterRecordedData) {
        state.isCashRegisterRecordedData = isCashRegisterRecordedData
    },
    IS_SESSION_EXPIRED(state, isUserTimeout) {
        state.isUserTimeout = isUserTimeout
    },
    LOGIN(state, loginData) {
        state.isUserTimeout = false
        state.loginData = loginData
    }
  },
  getters: {
    signUpData(state) {
        return state.signUpData
    },
    isUserTimeout(state) {
        return state.isUserTimeout
    },
    loginData(state) {
        return state.loginData;
    },
  },
};

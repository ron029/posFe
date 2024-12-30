import AUTH_API from "../APIs/auth";
import AXIOS from "@/plugins/axios";

export const authentication = {
  state: {
    isCashRegisterRecordedData: null,
    isUserTimeout: false,
    loginData: null,
  },
  actions: {
    login({commit}, args) {
        try {
            AUTH_API
            .login(args)
            .then(res => {
                commit('LOGIN', res.data)
            })
        } catch (err) {
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
        } catch (err) {
          console.error(err);
        }
      },
  },
  mutations: {
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
    isUserTimeout(state) {
        return state.isUserTimeout
    },
    loginData(state) {
        return state.loginData;
    },
  },
};

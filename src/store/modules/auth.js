import AUTH_API from "../APIs/auth";
import AXIOS from "@/plugins/axios";

export const authentication = {
  state: {
    loginData: null,
  },
  actions: {
    login({commit}, args) {
        try {
            AUTH_API
            .login(args)
            .then(res => {
                if (res.status === 200) {
                    commit('LOGIN', res.data)
                }
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
    LOGIN(state, loginData) {
        state.loginData = loginData
    }
  },
  getters: {
    loginData(state) {
        return state.loginData;
    },
  },
};

import userLoginAPI from "../../APIs/LoginAPI/LoginValidationAPI";
import router from "../../../router/index";
export const userLoginValidation = {
  state: {
    loginErr: "",
    userLoginStatus: "",
    userLoginModifier: "",
    isLoggedIn: false,
    isSessionExpired: "",
    isAccountLocked: "",
  },
  actions: {
    loginValidationProvider({ commit }, userLoginCredentials) {
      commit("USER_LOGIN_VALIDATION", "");
      userLoginAPI.validateLoginProvider(userLoginCredentials).then((res) => {
        // If true, will redirect to dashboard and login token is saved as cookie and loggedin cookie as modifier
        if (res.status == 200) {
          router.push("/provider/info");
        } else {
          // IF ACIVE AND USERNAME OR PASSWORD INCORRECT
          commit("USER_LOGIN_VALIDATION", res.data.state);
          // FOR login validation if user is INACTIVE or other NON-ACTIVE Status
          commit("USER_LOGIN_MODIFIER", res.data.MODIFIER);
          commit("USER_LOGIN_STATUS", res.data.status);
        }
      }).catch((error) => {
        if (error.response.status == 406){
          // IF ACIVE AND USERNAME OR PASSWORD INCORRECT
          commit("USER_LOGIN_VALIDATION", error.response.data.LOGIN_MSG);
          // FOR login validation if user is INACTIVE or other NON-ACTIVE Status
          commit("USER_LOGIN_MODIFIER", error.response.data.MODIFIER);
          commit("USER_LOGIN_STATUS", error.response.data.STATUS);
        }
      });
    },
    // Call this action when login button is clicked
    loginValidation({ commit }, userLoginCredentials) {
      commit("USER_LOGIN_VALIDATION", "");
      userLoginAPI.validateLogin(userLoginCredentials).then((res) => {
        // If true, will redirect to dashboard and login token is saved as cookie and loggedin cookie as modifier
        if (res.data.IS_LOGGED_IN) {
          router.push("/dashboard/info/");
        } else {
          // IF ACIVE AND USERNAME OR PASSWORD INCORRECT
          commit("USER_LOGIN_VALIDATION", res.data.LOGIN_MSG);
          // FOR login validation if user is INACTIVE or other NON-ACTIVE Status
          commit("USER_LOGIN_MODIFIER", res.data.MODIFIER);
          commit("USER_LOGIN_STATUS", res.data.STATUS);
        }
      }).catch((error) => {
        if (error.response.status === 406){
          // IF ACIVE AND USERNAME OR PASSWORD INCORRECT
          commit("USER_LOGIN_VALIDATION", error.response.data.LOGIN_MSG);
          // FOR login validation if user is INACTIVE or other NON-ACTIVE Status
          commit("USER_LOGIN_MODIFIER", error.response.data.MODIFIER);
          commit("USER_LOGIN_STATUS", error.response.data.STATUS);
        }
      });
    },

    // For verifying token login
    // If token is expired dialog will show and prompt session is expired
    verifyToken({ commit }) {
      userLoginAPI.verifyToken().then((res) => {
        if (res.status === 423) commit('IS_ACCOUNT_LOCKED', true);
        commit("IS_SESSION_EXPIRED", res.data.IS_EXPIRED);
      }).catch((error) => {
        if (error.response.status === 401) {
          commit("IS_SESSION_EXPIRED", error.response.data.IS_EXPIRED);
        }
      });
    },
    // User Logs out will remove cookie from the server
    // Removes cookies and refreshes the page
    userLogout() {
      // VueCookie.remove("loggedin");
      // VueCookie.remove("usermembn");
      // VueCookie.remove("PORTAL_LOGIN_AUTH");
      // window.location.reload();
      userLoginAPI.userLogout().then((res) => {
        window.location.href = '/'
      });
    },
  },
  mutations: {
    USER_LOGIN_VALIDATION(state, loginErr) {
      state.loginErr = loginErr;
    },
    USER_LOGIN_MODIFIER(state, userLoginModifier) {
      state.userLoginModifier = userLoginModifier;
    },
    USER_LOGIN_STATUS(state, userLoginStatus) {
      state.userLoginStatus = userLoginStatus;
    },
    IS_SESSION_EXPIRED(state, isSessionExpired) {
      state.isSessionExpired = isSessionExpired;
    },
    IS_ACCOUNT_LOCKED(state, isAccountLocked) {
        state.isAccountLocked = isAccountLocked;
    }
  },
  getters: {
    isAccountLocked(state) {
        return state.isAccountLocked;
    },
    getLoginErr(state) {
      return state.loginErr;
    },
    getModifierForUserLogin(state) {
      return state.userLoginModifier;
    },
    getUserLoginStatus(state) {
      return state.userLoginStatus;
    },
    isSessionExpired(state) {
      return state.isSessionExpired;
    },
  },
};

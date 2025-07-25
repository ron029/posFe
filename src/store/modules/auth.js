import AUTH_API from "../APIs/auth";
import AXIOS from "@/plugins/axios";
import EMPLOYEE_API from '../APIs/employee';

const getCookie = (name) => {
    let cookieArr = document.cookie.split(';')
    for (let i=0; i<cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split('=')
        if (name == cookiePair[0].trim()) {
            // console.log(name, cookiePair[0])
            return decodeURIComponent(cookieArr[i])
        }
    }
}

const getPermissions = (params) => {
    try {
        const permission = getCookie(params)
        const permissionStr = permission.replace('permissions=j:','')
        return JSON.parse(permissionStr)
    } catch (e) {
        return []
    }
}

export const authentication = {
    state: {
        findUserRolePermissionData: getPermissions('permissions')|| null,
        signUpData: null,
        isCashRegisterRecordedData: null,
        isUserTimeout: false,
        loginData: null,
        changePasswordSelfData: null,
        changePasswordStaffData: null,
    },
    actions: {
        changePasswordSelf({commit}, params) {
            try {
                AUTH_API
                    .changePasswordSelf(params)
                    .then(res => {
                        commit('CHANGE_PASSWORD_SELF', res.data)
                    })
            } catch (err) {
                commit('CHANGE_PASSWORD_SELF', err.response)
                console.error(err)
            }
        },
        changePasswordStaff({commit}, params) {
            try {
                AUTH_API
                    .changePasswordStaff(params)
                    .then(res => {
                        commit('CHANGE_PASSWORD_STAFF', res.data)
                    })
            } catch (err) {
                commit('CHANGE_PASSWORD_STAFF', err.response)
                console.error(err)
            }
        },
        findUserRolePermission({commit}, params) {
            try {
                EMPLOYEE_API
                    .findUserRolePermission(params)
                    .then(res => {
                        const permission = res && res.data && res.data.DATA && res.data.DATA.PERMISSIONS
                        commit('FIND_USER_ROLE_PERMISSION', permission ? permission : [])
                    })
            } catch (err) {
                commit('FIND_USER_ROLE_PERMISSION', [])
                console.error(err)
            }
        },
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
                        console.log('LOGIN RES: ', res)
                        commit('LOGIN', res.data)
                        // const permission = res && res.data && res.data.DATA && res.data.DATA.PERMISSIONS
                        // commit('FIND_USER_ROLE_PERMISSION', permission ? permission : [])
                    })
            } catch (err) {
                console.error('LOGIN ERROR: ', err.response)
                commit('LOGIN', err.response)
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
        CHANGE_PASSWORD_SELF(state, changePasswordSelfData) {
            state.changePasswordSelfData = changePasswordSelfData
        },
        CHANGE_PASSWORD_STAFF(state, changePasswordStaffData) {
            state.changePasswordStaffData = changePasswordStaffData
        },
        FIND_USER_ROLE_PERMISSION(state, findUserRolePermissionData) {
            state.findUserRolePermissionData = findUserRolePermissionData
        },
        SAVE_PERMISSION(state, permissionsData) {
            state.permissionsData = permissionsData
        },
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
        changePasswordStaffData(state) {
            return state.changePasswordStaffData
        },
        changePasswordSelfData(state) {
            return state.changePasswordSelfData
        },
        findUserRolePermissionData(state) {
            return state.findUserRolePermissionData
        },
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

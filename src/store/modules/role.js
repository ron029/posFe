import ROLE_API from "../APIs/role";

export const role = {
  state: {
    userRoleData: null,
    roleData: null,
    roleFindData: null,
    rolePutData: null,
    rolePostData: null,
  },
  actions: {
    userRole({commit}, params) {
        try {
            ROLE_API.userRole(params)
            .then(res => {
                commit('USER_ROLE', res.data)
            })
        } catch (err) {
            commit('USER_ROLE', err.response)
            console.log('userRole err: ', err)
        }
    },
    rolePost({commit}, params) {
        try {
            ROLE_API
                .rolePost(params)
                .then(res => {
                    commit('ROLE_POST', res.data)
                })
        } catch (err) {
            commit('ROLE_POST', err.response)
            console.error(err)
        }
    },
    rolePut({commit}, params) {
        try {
            ROLE_API
                .rolePut(params)
                .then(res => {
                    commit('ROLE_PUT', res.data)
                })
        } catch (err) {
            commit('ROLE_PUT', err.response)
            console.error(err)
        }
    },
    roleFind({commit}, params) {
        try {
            ROLE_API
                .roleFind(params)
                .then(res => {
                    commit('ROLE_FIND', res.data)
                })
        } catch (err) {
            commit('ROLE_FIND', err.response)
            console.error(err)
        }
    },
    role({commit}, params) {
        try {
            ROLE_API
                .role(params)
                .then(res => {
                    commit('ROLE', res.data)
                })
        } catch (err) {
            commit('ROLE', err.response)
            console.error(err)
        }
    },
  },
  mutations: {
    USER_ROLE(state, userRoleData) {
        state.userRoleData = userRoleData
    },
    ROLE_POST(state, rolePostData) {
        state.rolePostData = rolePostData
    },
    ROLE_PUT(state, rolePutData) {
        state.rolePutData = rolePutData
    },
    ROLE_FIND(state, roleFindData) {
        state.roleFindData = roleFindData
    },
    ROLE(state, roleData) {
        state.roleData = roleData
    },
  },
  getters: {
    userRoleData(state) {
        return state.userRoleData
    },
    rolePostData(state) {
        return state.rolePostData
    },
    rolePutData(state) {
        return state.rolePutData
    },
    roleFindData(state) {
        return state.roleFindData
    },
    roleData(state) {
        return state.roleData
    },
  },
};

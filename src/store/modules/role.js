import ROLE_API from "../APIs/role";

export const role = {
  state: {
    roleData: null,
    roleFindData: null,
    rolePutData: null,
  },
  actions: {
    rolePut({commit}, args) {
        try {
            ROLE_API
                .rolePut(args)
                .then(res => {
                    commit('ROLE_PUT', res.data)
                })
        } catch (err) {
            commit('ROLE_PUT', err.response)
            console.error(err)
        }
    },
    roleFind({commit}, args) {
        try {
            ROLE_API
                .roleFind(args)
                .then(res => {
                    commit('ROLE_FIND', res.data)
                })
        } catch (err) {
            commit('ROLE_FIND', err.response)
            console.error(err)
        }
    },
    role({commit}, args) {
        try {
            ROLE_API
                .role(args)
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

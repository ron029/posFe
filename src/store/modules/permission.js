import PERMISSION_API from "../APIs/permission";

export const permission = {
  state: {
    permissionData: null,
    permissionFindData: null,
    permissionPutData: null,
  },
  actions: {
    permissionPut({commit}, args) {
        try {
            PERMISSION_API
                .permissionPut(args)
                .then(res => {
                    commit('PERMISSION_PUT', res.data)
                })
        } catch (err) {
            commit('PERMISSION_PUT', err.response)
            console.error(err)
        }
    },
    permissionFind({commit}, args) {
        try {
            PERMISSION_API
                .permissionFind(args)
                .then(res => {
                    commit('PERMISSION_FIND', res.data)
                })
        } catch (err) {
            commit('PERMISSION_FIND', err.response)
            console.error(err)
        }
    },
    permission({commit}, args) {
        try {
            PERMISSION_API
                .permission(args)
                .then(res => {
                    commit('PERMISSION', res.data)
                })
        } catch (err) {
            commit('PERMISSION', err.response)
            console.error(err)
        }
    },
  },
  mutations: {
    PERMISSION_PUT(state, permissionPutData) {
        state.permissionPutData = permissionPutData
    },
    PERMISSION_FIND(state, permissionFindData) {
        state.permissionFindData = permissionFindData
    },
    PERMISSION(state, permissionData) {
        state.permissionData = permissionData
    },
  },
  getters: {
    permissionPutData(state) {
        return state.permissionPutData
    },
    permissionFindData(state) {
        return state.permissionFindData
    },
    permissionData(state) {
        return state.permissionData
    },
  },
};

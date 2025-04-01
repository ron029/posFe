import MANAGE_DATABASE_API from "../APIs/manageDatabase";

export const manageDatabase = {
  state: {
    backupData: null,
  },
  actions: {
    backup({commit}, args) {
        try {
            MANAGE_DATABASE_API
                .backup(args)
                .then(res => {
                    commit('BACKUP', res.data)
                })
        } catch (err) {
            commit('BACKUP', err.response)
            console.error(err)
        }
    },
  },
  mutations: {
    BACKUP(state, backupData) {
        state.backupData = backupData
    },
  },
  getters: {
    backupData(state) {
        return state.backupData
    },
  },
};

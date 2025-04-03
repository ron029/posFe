import LOGGER_API from "../APIs/logger";

export const logger = {
  state: {
    loggerData: null,
  },
  actions: {
    logger({commit}, args) {
        try {
            LOGGER_API
                .logger(args)
                .then(res => {
                    commit('LOGGER', res.data)
                })
        } catch (err) {
            commit('LOGGER', err.response)
            console.error(err)
        }
    },
  },
  mutations: {
    LOGGER(state, loggerData) {
        state.loggerData = loggerData
    },
  },
  getters: {
    loggerData(state) {
        return state.loggerData
    },
  },
};

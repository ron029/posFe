import AUTH_API from "../APIs/reorder";

export const reorder = {
  state: {
    newReorderData: null,
    fetchReorderData: null,
  },
  actions: {
    newReorder({commit}, data) {
        try {
            AUTH_API
            .newReorder(data)
            .then(res => {
                commit('NEW_REORDER', res.data)
            })
        } catch (err) {
            console.error(err)
        }
    },
    fetchReorder({commit}) {
        try {
            AUTH_API
            .fetchReorder()
            .then(res => {
                commit('FETCH_REORDER', res.data)
            })
        } catch (err) {
            console.error(err)
        }
    },
  },
  mutations: {
    NEW_REORDER(state, newReorderData) {
        state.newReorderData = newReorderData
    },
    FETCH_REORDER(state, fetchReorderData) {
        state.fetchReorderData = fetchReorderData
    }
  },
  getters: {
    newReorderData(state) {
        return state.newReorderData
    },
    fetchReorderData(state) {
        return state.fetchReorderData
    },
  },
};

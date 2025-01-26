import AUTH_API from "../APIs/reorder";

export const reorder = {
  state: {
    destroyReorderData: null,
    newReorderData: null,
    fetchReorderData: null,
  },
  actions: {
    destroyReorder({commit}, data) {
        try {
            AUTH_API
                .destroyReorder(data)
                .then(res => {
                    commit('DESTROY_REORDER', res.data)
                })
        } catch (err) {
            commit('DESTROY_REORDER', err.response)
            console.log('destroyReorder err: ', err)
        }
    },
    newReorder({commit}, data) {
        try {
            AUTH_API
                .newReorder(data)
                .then(res => {
                    commit('NEW_REORDER', res.data)
                })
        } catch (err) {
            commit('NEW_REORDER', err.response)
            console.error('newReorder err: ', err)
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
            commit('FETCH_REORDER', err.response)
            console.error('fetchReorder err: ', err)
        }
    },
  },
  mutations: {
    DESTROY_REORDER(state, destroyReorderData) {
        state.destroyReorderData = destroyReorderData
    },
    NEW_REORDER(state, newReorderData) {
        state.newReorderData = newReorderData
    },
    FETCH_REORDER(state, fetchReorderData) {
        state.fetchReorderData = fetchReorderData
    }
  },
  getters: {
    destroyReorderData(state) {
        return state.destroyReorderData
    },
    newReorderData(state) {
        return state.newReorderData
    },
    fetchReorderData(state) {
        return state.fetchReorderData
    },
  },
};

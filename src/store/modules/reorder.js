import AUTH_API from "../APIs/reorder";

export const reorder = {
  state: {
    fetchReorderData: null,
  },
  actions: {
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
    FETCH_REORDER(state, fetchReorderData) {
        state.fetchReorderData = fetchReorderData
    }
  },
  getters: {
    fetchReorderData(state) {
        return state.fetchReorderData;
    },
  },
};

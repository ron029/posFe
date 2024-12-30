import CASH_REGISTER_API from "../APIs/sales";

export const sales = {
  state: {
    fetchSalesData: null,
  },
  actions: {
    fetchSales({commit}, args) {
        try {
            CASH_REGISTER_API
            .fetchSales(args)
            .then(res => {
                commit('FETCH_SALES', res.data)
            })
        } catch (err) {
            console.error(err)
        }
    },
  },
  mutations: {
    FETCH_SALES(state, fetchSalesData) {
        state.fetchSalesData = fetchSalesData
    },
  },
  getters: {
    fetchSalesData(state) {
        return state.fetchSalesData
    },
  },
};

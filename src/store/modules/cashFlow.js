import CASH_REGISTER_API from "../APIs/cashFlow";
import store from "..";
export const registerCashFlow = {
  state: {
    fetchSalesBySessionData: null,
    getExistingCashFlowData: null,
    registerCashFlowData: null,
  },
  actions: {
    fetchSalesBySession({commit}, data) {
        try {
            CASH_REGISTER_API
            .fetchSalesBySession(data)
            .then(res => {
                commit('FETCH_SALES_BY_SESSION', res.data)
            })
        } catch (err) {
            console.error(err)
        }
    },
    getExistingCashFlow({commit}, data) {
        try {
            CASH_REGISTER_API
            .getExistingCashFlow(data)
            .then(res => {
                if (res.status === 200) {
                    store.commit('IS_CASH_REGISTER_RECORDED', true)
                }
                commit('GET_EXISTING_CASH_FLOW', res.data)
            })
        } catch (err) {
            console.error(err)
        }
    },
    registerCashFlow({commit}, args) {
        try {
            CASH_REGISTER_API
            .registerCashFlow(args)
            .then(res => {
                if (res.status === 200) {
                    store.commit('IS_CASH_REGISTER_RECORDED', true)
                }
                commit('REGISTER_CASH_FLOW', res.data)
            })
        } catch (err) {
            console.error(err)
        }
    },
  },
  mutations: {
    FETCH_SALES_BY_SESSION(state, fetchSalesBySessionData) {
        state.fetchSalesBySessionData = fetchSalesBySessionData
    },
    GET_EXISTING_CASH_FLOW(state, getExistingCashFlowData) {
        state.getExistingCashFlowData = getExistingCashFlowData
    },
    REGISTER_CASH_FLOW(state, registerCashFlowData) {
        state.registerCashFlowData = registerCashFlowData
    },
  },
  getters: {
    fetchSalesBySessionData(state) {
        return state.fetchSalesBySessionData
    },
    getExistingCashFlowData(state) {
        return state.getExistingCashFlowData
    },
    registerCashFlowData(state) {
        return state.registerCashFlowData
    },
  },
};

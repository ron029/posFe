import CASH_REGISTER_API from "../APIs/cashReg";

export const cashReg = {
  state: {
    getNextSalesIdData: null,
    saveSalesData: null,
    findBarcodeData: null,
    retriveTransactionData: null,
    saveSalesModifiedData: null,
  },
  actions: {
    getNextSalesId({commit}, args) {
        try {
            CASH_REGISTER_API
            .getNextSalesId(args)
            .then(res => {
                commit('GET_NEXT_SALES_ID', res.data)
            })
        } catch (err) {
            commit('GET_NEXT_SALES_ID', err.response)
            console.error(err)
        }
    },
    saveSales({commit}, args) {
        try {
            CASH_REGISTER_API
            .saveSales(args)
            .then(res => {
                commit('SAVE_SALES', res.data)
            })
        } catch (err) {
            commit('SAVE_SALES', err.response)
            console.error(err)
        }
    },
    findBarcode({commit}, args) {
        try {
            CASH_REGISTER_API
            .findBarcode(args)
            .then(res => {
                commit('FIND_BARCODE', res.data)
            })
        } catch (err) {
            commit('FIND_BARCODE', err.response)
            console.error(err)
        }
    },
    retriveTransaction({commit}, args) {
        try {
            CASH_REGISTER_API
            .retriveTransaction(args)
            .then(res => {
                commit('RETRIEVE_TRANSACTION', res.data)
            })
        } catch (err) {
            commit('RETRIEVE_TRANSACTION', err.response)
            console.error(err)
        }
    },
    saveSalesModified({commit}, args) {
        try {
            CASH_REGISTER_API
            .saveSalesModified(args)
            .then(res => {
                commit('SAVE_SALES_MODIFIED', res.data)
            })
        } catch (err) {
            commit('SAVE_SALES_MODIFIED', err.response)
            console.error(err)
        }
    },
  },
  mutations: {
    RETRIEVE_TRANSACTION(state, retriveTransactionData) {
        state.retriveTransactionData = retriveTransactionData
    },
    GET_NEXT_SALES_ID(state, getNextSalesIdData) {
        state.getNextSalesIdData = getNextSalesIdData
    },
    SAVE_SALES(state, saveSalesData) {
        state.saveSalesData = saveSalesData
    },
    FIND_BARCODE(state, findBarcodeData) {
        state.findBarcodeData = findBarcodeData
    },
    SAVE_SALES_MODIFIED(state, saveSalesModifiedData) {
        state.saveSalesModifiedData = saveSalesModifiedData
    },
  },
  getters: {
    retriveTransactionData(state) {
        return state.retriveTransactionData
    },
    getNextSalesIdData(state) {
        return state.getNextSalesIdData
    },
    saveSalesData(state) {
        return state.saveSalesData
    },
    findBarcodeData(state) {
        return state.findBarcodeData
    },
    saveSalesModifiedData(state) {
        return state.saveSalesModifiedData
    }
  },
};

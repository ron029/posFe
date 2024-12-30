import CASH_REGISTER_API from "../APIs/cashReg";

export const cashReg = {
  state: {
    saveSalesData: null,
    findBarcodeData: null,
  },
  actions: {
    saveSales({commit}, args) {
        try {
            CASH_REGISTER_API
            .saveSales(args)
            .then(res => {
                commit('SAVE_SALES', res.data)
            })
        } catch (err) {
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
            console.error(err)
        }
    },
  },
  mutations: {
    SAVE_SALES(state, saveSalesData) {
        state.saveSalesData = saveSalesData
    },
    FIND_BARCODE(state, findBarcodeData) {
        state.findBarcodeData = findBarcodeData
    },
  },
  getters: {
    saveSalesData(state) {
        return state.saveSalesData
    },
    findBarcodeData(state) {
        return state.findBarcodeData
    },
  },
};

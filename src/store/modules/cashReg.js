import CASH_REGISTER_API from "../APIs/cashReg";

export const cashReg = {
  state: {
    findBarcodeData: null,
  },
  actions: {
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
    FIND_BARCODE(state, findBarcodeData) {
        state.findBarcodeData = findBarcodeData
    },
  },
  getters: {
    findBarcodeData(state) {
        return state.findBarcodeData
    },
  },
};

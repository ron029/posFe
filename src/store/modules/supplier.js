import DASH_API from "../APIs/dash";

export const supplier = {
  state: {
    // suppliers
    supplierPostData: null,
    supplierData: null,
    supplierPutData: null,
    supplierDeleteData: null,
  },
  actions: {
    // suppliers
    async supplierPost({commit}, args) {
        try {
            await DASH_API
            .supplierPost(args)
            .then(res => {
                if (res.status === 200) {
                    commit('SUPPLIER_POST', res.data)
                }
            })
        } catch (err) {
            commit('SUPPLIER_POST', err.response)
            console.error(err)
        }
    },
    suppliers({commit}) {
        try {
            DASH_API
            .suppliers()
            .then(res => {
                if (res.status === 200) {
                    commit('SUPPLIERS', res.data)
                }
            })
        } catch (err) {
            commit('SUPPLIERS', err.response)
            console.error(err)
        }
    },
    supplierPut({commit}, args) {
        try {
            DASH_API
            .supplierPut(args)
            .then(res => {
                if (res.status === 200) {
                    commit('SUPPLIER_PUT', res.data)
                }
            })
        } catch (err) {
            commit('SUPPLIER_PUT', err.response)
            console.error(err)
        }
    },
    supplierDelete({commit}, args) {
        try {
            DASH_API
            .supplierDelete(args)
            .then(res => {
                if (res.status === 200) {
                    commit('SUPPLIER_DELETE', res.data)
                }
            })
        } catch (err) {
            commit('SUPPLIER_DELETE', err.response)
            console.error(err)
        }
    },
  },
  mutations: {
    // supplier
    SUPPLIER_POST(state, supplierPostData) {
        state.supplierPostData = supplierPostData
    },
    SUPPLIERS(state, supplierData) {
        state.supplierData = supplierData
    },
    SUPPLIER_PUT(state, supplierPutData) {
        state.supplierPutData = supplierPutData
    },
    SUPPLIER_DELETE(state, supplierDeleteData) {
        state.supplierDeleteData = supplierDeleteData
    },
  },
  getters: {
    // suppliers
    supplierPostData(state) {
        return state.supplierPostData
    },
    supplierData(state) {
        return state.supplierData
    },
    supplierPutData(state) {
        return state.supplierPutData
    },
    supplierDeleteData(state) {
        return state.supplierDeleteData
    },
  },
};

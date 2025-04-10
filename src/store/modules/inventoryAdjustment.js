import INVENTORY_ADJUSTMENTS_API from "../APIs/inventoryAdjustment";

export const inventoryAdjustments = {
  state: {
    inventoryAdjustmentsPostData: null,
    inventoryAdjustmentsGetData: null,
    inventoryAdjustmentsFindData: null,
  },
  actions: {
    inventoryAdjustmentsFind({commit}, args) {
        try {
            INVENTORY_ADJUSTMENTS_API
                .inventoryAdjustmentsFind(args)
                .then(res => {
                    commit('INVENTORY_ADJUSTMENTS_FIND', res.data)
                })
        } catch (err) {
            commit('INVENTORY_ADJUSTMENTS_FIND', err.response)
            console.error(err)
        }
    },
    inventoryAdjustmentsPost({commit}, args) {
        try {
            INVENTORY_ADJUSTMENTS_API
                .inventoryAdjustmentsPost(args)
                .then(res => {
                    commit('INVENTORY_ADJUSTMENTS_POST', res.data)
                })
        } catch (err) {
            commit('INVENTORY_ADJUSTMENTS_POST', err.response)
            console.error(err)
        }
    },
    inventoryAdjustmentsGet({commit}) {
        try {
            INVENTORY_ADJUSTMENTS_API
                .inventoryAdjustmentsGet()
                .then(res => {
                    commit('INVENTORY_ADJUSTMENTS_GET', res.data)
                })
        } catch (err) {
            commit('INVENTORY_ADJUSTMENTS_GET', err.response)
            console.error(err)
        }
    }
  },
  mutations: {
    INVENTORY_ADJUSTMENTS_FIND(state, inventoryAdjustmentsFindData) {
        state.inventoryAdjustmentsFindData = inventoryAdjustmentsFindData
    },
    INVENTORY_ADJUSTMENTS_POST(state, inventoryAdjustmentsPostData) {
        state.inventoryAdjustmentsPostData = inventoryAdjustmentsPostData
    },
    INVENTORY_ADJUSTMENTS_GET(state, inventoryAdjustmentsGetData) {
        state.inventoryAdjustmentsGetData = inventoryAdjustmentsGetData
    }
  },
  getters: {
    inventoryAdjustmentsFindData(state) {
        return state.inventoryAdjustmentsFindData
    },
    inventoryAdjustmentsPostData(state) {
        return state.inventoryAdjustmentsPostData
    },
    inventoryAdjustmentsGetData(state) {
        return state.inventoryAdjustmentsGetData
    }
  },
};

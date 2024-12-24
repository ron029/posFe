import DASH_API from "../APIs/dash";

export const unit = {
  state: {
    // units
    unitPostData: null,
    unitData: null,
    unitPutData: null,
    unitDeleteData: null,
  },
  actions: {
    // units
    async unitPost({commit}, args) {
        try {
            await DASH_API
            .unitPost(args)
            .then(res => {
                if (res.status === 200) {
                    commit('UNIT_POST', res.data)
                }
            })
        } catch (err) {
            console.error(err)
        }
    },
    units({commit}) {
        try {
            DASH_API
            .units()
            .then(res => {
                if (res.status === 200) {
                    commit('UNITS', res.data)
                }
            })
        } catch (err) {
            console.error(err)
        }
    },
    unitPut({commit}, args) {
        try {
            DASH_API
            .unitPut(args)
            .then(res => {
                if (res.status === 200) {
                    commit('UNIT_PUT', res.data)
                }
            })
        } catch (err) {
            console.error(err)
        }
    },
    unitDelete({commit}, args) {
        try {
            DASH_API
            .unitDelete(args)
            .then(res => {
                if (res.status === 200) {
                    commit('UNIT_DELETE', res.data)
                }
            })
        } catch (err) {
            console.error(err)
        }
    },
  },
  mutations: {
    // units
    UNIT_POST(state, unitPostData) {
        state.unitPostData = unitPostData
    },
    UNITS(state, unitData) {
        state.unitData = unitData
    },
    UNIT_PUT(state, unitPutData) {
        state.unitPutData = unitPutData
    },
    UNIT_DELETE(state, unitDeleteData) {
        state.unitDeleteData = unitDeleteData
    },
  },
  getters: {
    // units
    unitPostData(state) {
        return state.unitPostData
    },
    unitData(state) {
        return state.unitData
    },
    unitPutData(state) {
        return state.unitPutData
    },
    unitDeleteData(state) {
        return state.unitDeleteData
    },
  },
};

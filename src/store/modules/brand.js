import DASH_API from "../APIs/dash";

export const brand = {
  state: {
    // brands
    brandPostData: null,
    brandData: null,
    brandPutData: null,
    brandDeleteData: null,
  },
  actions: {
    // brands
    async brandPost({commit}, args) {
        try {
            await DASH_API
            .brandPost(args)
            .then(res => {
                if (res.status === 200) {
                    commit('BRAND_POST', res.data)
                }
            })
        } catch (err) {
            console.error(err)
        }
    },
    brands({commit}) {
        try {
            DASH_API
            .brands()
            .then(res => {
                if (res.status === 200) {
                    commit('BRANDS', res.data)
                }
            })
        } catch (err) {
            console.error(err)
        }
    },
    brandPut({commit}, args) {
        try {
            DASH_API
            .brandPut(args)
            .then(res => {
                if (res.status === 200) {
                    commit('BRAND_PUT', res.data)
                }
            })
        } catch (err) {
            console.error(err)
        }
    },
    brandDelete({commit}, args) {
        try {
            DASH_API
            .brandDelete(args)
            .then(res => {
                if (res.status === 200) {
                    commit('BRAND_DELETE', res.data)
                }
            })
        } catch (err) {
            console.error(err)
        }
    },
  },
  mutations: {
    // brands
    BRAND_POST(state, brandPostData) {
        state.brandPostData = brandPostData
    },
    BRANDS(state, brandData) {
        state.brandData = brandData
    },
    BRAND_PUT(state, brandPutData) {
        state.brandPutData = brandPutData
    },
    BRAND_DELETE(state, brandDeleteData) {
        state.brandDeleteData = brandDeleteData
    },
  },
  getters: {
    // brands
    brandPostData(state) {
        return state.brandPostData
    },
    brandData(state) {
        return state.brandData
    },
    brandPutData(state) {
        return state.brandPutData
    },
    brandDeleteData(state) {
        return state.brandDeleteData
    },
  },
};

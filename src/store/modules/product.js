import DASH_API from "../APIs/dash";

export const product = {
  state: {
    // products
    productPostData: null,
    productData: null,
    productPutData: null,
    productDeleteData: null,
  },
  actions: {
    // products
    async productPost({commit}, args) {
        try {
            await DASH_API
            .productPost(args)
            .then(res => {
                if (res.status === 200) {
                    commit('PRODUCT_POST', res.data)
                }
            })
        } catch (err) {
            console.error(err)
        }
    },
    products({commit}) {
        try {
            DASH_API
            .products()
            .then(res => {
                if (res.status === 200) {
                    commit('PRODUCTS', res.data)
                }
            })
        } catch (err) {
            console.error(err)
        }
    },
    productPut({commit}, args) {
        try {
            DASH_API
            .productPut(args)
            .then(res => {
                if (res.status === 200) {
                    commit('PRODUCT_PUT', res.data)
                }
            })
        } catch (err) {
            console.error(err)
        }
    },
    productDelete({commit}, args) {
        try {
            DASH_API
            .productDelete(args)
            .then(res => {
                if (res.status === 200) {
                    commit('PRODUCT_DELETE', res.data)
                }
            })
        } catch (err) {
            console.error(err)
        }
    },
  },
  mutations: {
    // product
    PRODUCT_POST(state, productPostData) {
        state.productPostData = productPostData
    },
    PRODUCTS(state, productData) {
        state.productData = productData
    },
    PRODUCT_PUT(state, productPutData) {
        state.productPutData = productPutData
    },
    PRODUCT_DELETE(state, productDeleteData) {
        state.productDeleteData = productDeleteData
    },
  },
  getters: {
    // products
    productPostData(state) {
        return state.productPostData
    },
    productData(state) {
        return state.productData
    },
    productPutData(state) {
        return state.productPutData
    },
    productDeleteData(state) {
        return state.productDeleteData
    },
  },
};

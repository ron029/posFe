import PRODUCT_EXPIRATION_API from "../APIs/productExpiration";

export const productExpiration = {
  state: {
    productExpirationData: null,
    productExpirationsPostData: null,
    productExpirationPutData: null,
  },
  actions: {
    productExpirationPut({commit}, args) {
        try {
            PRODUCT_EXPIRATION_API
                .productExpirationPut(args)
                .then(res => {
                    commit('PRODUCT_EXPIRATION_PUT', res.data)
                })
        } catch (err) {
            commit('PRODUCT_EXPIRATION_PUT', err.response)
            console.error(err)
        }
    },
    productExpiration({commit}) {
        try {
            PRODUCT_EXPIRATION_API
                .productExpiration()
                .then(res => {
                    commit('PRODUCT_EXPIRATION', res.data)
                })
        } catch (err) {
            commit('PRODUCT_EXPIRATION', err.response)
            console.error(err)
        }
    },
    async productExpirationsPost({commit}, args) {
        try {
            await PRODUCT_EXPIRATION_API
                .productExpirationsPost(args)
                .then(res => {
                    commit('PRODUCT_EXPIRATION_POST', res.data)
                })
        } catch (err) {
            commit('PRODUCT_EXPIRATION_POST', err.response)
            console.error(err)
        }
    },
  },
  mutations: {
    PRODUCT_EXPIRATION_PUT(state, productExpirationPutData) {
        state.productExpirationPutData = productExpirationPutData
    },
    PRODUCT_EXPIRATION(state, productExpirationData) {
        state.productExpirationData = productExpirationData
    },
    PRODUCT_EXPIRATION_POST(state, productExpirationsPostData) {
        state.productExpirationsPostData = productExpirationsPostData
    },
  },
  getters: {
    productExpirationPutData(state) {
        return state.productExpirationPutData
    },
    productExpirationData(state) {
        return state.productExpirationData
    },
    productExpirationsPostData(state) {
        return state.productExpirationsPostData
    },
  },
};

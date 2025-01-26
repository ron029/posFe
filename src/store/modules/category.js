import DASH_API from "../APIs/dash";

export const category = {
  state: {
    // categories
    categoryPostData: null,
    categoryData: null,
    categoryPutData: null,
    categoryDeleteData: null,
  },
  actions: {
    // categories
    async categoryPost({commit}, args) {
        try {
            await DASH_API
            .categoryPost(args)
            .then(res => {
                if (res.status === 200) {
                    commit('CATEGORY_POST', res.data)
                }
            })
        } catch (err) {
            commit('CATEGORY_POST', err.response)
            console.error(err)
        }
    },
    categories({commit}) {
        try {
            DASH_API
            .categories()
            .then(res => {
                if (res.status === 200) {
                    commit('CATEGORIES', res.data)
                }
            })
        } catch (err) {
            commit('CATEGORIES', err.response)
            console.error(err)
        }
    },
    categoryPut({commit}, args) {
        try {
            DASH_API
            .categoryPut(args)
            .then(res => {
                if (res.status === 200) {
                    commit('CATEGORY_PUT', res.data)
                }
            })
        } catch (err) {
            commit('CATEGORY_PUT', err.response)
            console.error(err)
        }
    },
    categoryDelete({commit}, args) {
        try {
            DASH_API
            .categoryDelete(args)
            .then(res => {
                if (res.status === 200) {
                    commit('CATEGORY_DELETE', res.data)
                }
            })
        } catch (err) {
            commit('CATEGORY_DELETE', err.response)
            console.error(err)
        }
    },
  },
  mutations: {
    // categories
    CATEGORY_POST(state, categoryPostData) {
        state.categoryPostData = categoryPostData
    },
    CATEGORIES(state, categoryData) {
        state.categoryData = categoryData
    },
    CATEGORY_PUT(state, categoryPutData) {
        state.categoryPutData = categoryPutData
    },
    CATEGORY_DELETE(state, categoryDeleteData) {
        state.categoryDeleteData = categoryDeleteData
    }
  },
  getters: {
    // categories
    categoryPostData(state) {
        return state.categoryPostData
    },
    categoryData(state) {
        return state.categoryData
    },
    categoryPutData(state) {
        return state.categoryPutData
    },
    categoryDeleteData(state) {
        return state.categoryDeleteData
    },
  },
};

import DASH_API from "../APIs/dash";

export const dash = {
  state: {
    // suppliers
    supplierPostData: null,
    supplierData: null,
    supplierPutData: null,
    supplierDeleteData: null,

    // brands
    brandPostData: null,
    brandData: null,
    brandPutData: null,
    brandDeleteData: null,

    // units
    unitPostData: null,
    unitData: null,
    unitPutData: null,
    unitDeleteData: null,

    // categories
    categoryPostData: null,
    categoryData: null,
    categoryPutData: null,
    categoryDeleteData: null,
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
            console.error(err)
        }
    },


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

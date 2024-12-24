import API from "@/plugins/axios"

export default {
    // products
    products() {
        return API.get('/dash/products')
    },
    productPost(data) {
        return API.post('/dash/products', data)
    },
    productDelete(data) {
        return API.delete(`/dash/products/${data.product_id}`)
    },
    productPut(data) {
        return API.put(`/dash/products/${data.product_id}`, data)
    },

    // suppliers
    suppliers() {
        return API.get('/dash/suppliers')
    },
    supplierPost(data) {
        return API.post('/dash/suppliers', data)
    },
    supplierDelete(data) {
        return API.delete(`/dash/suppliers/${data.supplier_id}`)
    },
    supplierPut(data) {
        return API.put(`/dash/suppliers/${data.supplier_id}`, data)
    },

    // brands
    brands() {
        return API.get('/dash/brands')
    },
    brandPost(data) {
        return API.post('/dash/brands', data)
    },
    brandDelete(data) {
        return API.delete(`/dash/brands/${data.brand_id}`)
    },
    brandPut(data) {
        return API.put(`/dash/brands/${data.brand_id}`, data)
    },

    // units
    units() {
        return API.get('/dash/units')
    },
    unitPost(data) {
        return API.post('/dash/units', data)
    },
    unitDelete(data) {
        return API.delete(`/dash/brands/${data.unit_id}`)
    },
    unitPut(data) {
        return API.put(`/dash/brands/${data.unit_id}`, data)
    },

    // categories
    categories() {
        return API.get('/dash/categories')
    },
    categoryPost(data) {
        return API.post('/dash/categories', data)
    },
    categoryDelete(data) {
        return API.delete(`/dash/categories/${data.category_id}`)
    },
    categoryPut(data) {
        return API.put(`/dash/categories/${data.category_id}`, data)
    },
};

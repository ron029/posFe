import API from "@/plugins/axios"

export default {
    productExpiration() {
        return API.get(`/product_expiration/`)
    },
    async productExpirationsPost(data) {
        return await API.post(`/product_expiration/`, data)
    },
    productExpirationPut(data) {
        return API.put(`/product_expiration/${data.product_expiration_id}`, data)
    },
};

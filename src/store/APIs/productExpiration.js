import API from "@/plugins/axios"

export default {
    productExpiration() {
        return API.get(`/product_expiration/`)
    },
    productExpirationsPost(data) {
        return API.post(`/product_expiration/`, data)
    },
};

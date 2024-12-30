import API from "@/plugins/axios"

export default {
    fetchSales(data) {
        return API.post('/sales', data)
    },
};

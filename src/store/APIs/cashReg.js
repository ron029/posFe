import API from "@/plugins/axios"

export default {
    findBarcode(data) {
        return API.post('/cash-reg/findBarcode', data)
    },
};

import API from "@/plugins/axios"

export default {
    saveSales(data) {
        return API.post('/cash-reg/save-sales', data)
    },
    findBarcode(data) {
        return API.post('/cash-reg/find-barcode', data)
    },
};

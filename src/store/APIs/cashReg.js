import API from "@/plugins/axios"

export default {
    saveSales(data) {
        return API.post('/cash-reg/save-sales', data)
    },
    findBarcode(data) {
        return API.post('/cash-reg/find-barcode', data)
    },
    getNextSalesId() {
        return API.get('/cash-reg/get-next-sales-id')
    },
    retriveTransaction(data) {
        return API.post('/cash-reg/retrive-transaction', data)
    },
    saveSalesModified(data) {
        return API.post('/cash-reg/save-sales-modified', data)
    },
};

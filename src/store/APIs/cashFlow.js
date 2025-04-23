import API from "@/plugins/axios"

export default {
    fetchCashFlowSummary(data) {
        return API.post('/cash-flow/get_summary', data)
    },
    registerCashFlow(data) {
        return API.post('/cash-flow/register', data)
    },
    getExistingCashFlow(data) {
        return API.post('/cash-flow/get-existing-cash-flow', data)
    },
    fetchSalesBySession(data) {
        return API.post('/cash-flow/fetch-sales-by-session', data)
    },
    allCashFlow() {
        return API.get('/cash-flow/')
    }
};

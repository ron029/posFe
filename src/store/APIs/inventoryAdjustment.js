import API from "@/plugins/axios"

export default {
    inventoryAdjustmentsPost(data) {
        return API.post('/inventory-adjustments/', data)
    },
    inventoryAdjustmentsGet(data) {
        return API.get('/inventory-adjustments/', data)
    },
    inventoryAdjustmentsFind(data) {
        return API.get(`/inventory-adjustments/${data.referenceNum}`)
    }
};

import API from "@/plugins/axios"

export default {
    destroyReorder(data) {
        return API.post('/reorder/destroy', data)
    },
    newReorder(data) {
        return API.post('/reorder/new', data)
    },
    fetchReorder() {
        return API.post('/reorder/')
    },
};

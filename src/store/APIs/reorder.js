import API from "@/plugins/axios"

export default {
    newReorder(data) {
        return API.post('/reorder/new', data)
    },
    fetchReorder() {
        return API.post('/reorder/')
    },
};

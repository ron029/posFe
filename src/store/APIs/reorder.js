import API from "@/plugins/axios"

export default {
    fetchReorder() {
        return API.post('/reorder/')
    },
};

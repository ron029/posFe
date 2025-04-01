import API from "@/plugins/axios"

export default {
    backup() {
        return API.post('/manage-db/backup')
    },
};

import API from "@/plugins/axios"

export default {
    logger() {
        return API.get(`/log`)
    },
};

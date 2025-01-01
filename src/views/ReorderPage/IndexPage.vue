<template>
    <h1>Reorder Level</h1>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data: () => ({
        reorders: [],
        ignoredReorders: []
    }),
    computed: {
        ...mapGetters(['fetchReorderData'])
    },
    watch: {
        fetchReorderData(newVal) {
            if (newVal.STATUS === 200) {
                this.reorders = (newVal.DATA).filter(item => item.isIgnoreReorder !== 0)
                this.ignoredReorders = (newVal.DATA).filter(item => item.isIgnoreReorder !== 1)
            }
        }
    },
    methods: {
        ...mapActions(['getCsrfToken', 'fetchReorder'])
    },
    async mounted() {
        await this.getCsrfToken()
        this.fetchReorder()
    }
}
</script>

<template>
    <div>
        <h1>Reorder Level</h1>
        <MainPage
            :reorders="reorders"
            :ignoredReorders="ignoredReorders"
        />
    </div>
</template>

<script>
import MainPage from './MainPage.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        MainPage,
    },
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
                this.reorders = (newVal.DATA).filter(item => item.is_ignored_reorder !== 1)
                this.ignoredReorders = (newVal.DATA).filter(item => item.is_ignored_reorder === 1)
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

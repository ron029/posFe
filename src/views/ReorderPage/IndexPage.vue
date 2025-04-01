<template>
    <div style="padding: 0 20px">
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
        ...mapGetters(['fetchReorderData', 'newReorderData', 'destroyReorderData', 'findUserRolePermissionData']),
        isUserCanReadReorder() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'reorder:1')
            return false
        },
    },
    watch: {
        fetchReorderData(newVal) {
            if (newVal.STATUS === 200) {
                this.setReorderAndIgnore(newVal.DATA)
            } else {
                console.error(newVal.STATE)
            }
        },
        newReorderData(newVal) {
            if (newVal.STATUS === 201) {
                this.fetchReorder()
            } else {
                console.error(newVal.STATE)
            }
        },
        destroyReorderData(newVal) {
            if (newVal.STATUS === 200) {
                this.fetchReorder()
            } else {
                console.error(newVal.STATE)
            }
        },
    },
    methods: {
        ...mapActions(['getCsrfToken', 'fetchReorder']),
        setReorderAndIgnore(data) {
            this.reorders = (data).filter(item => item.is_ignored_reorder !== 1)
            this.ignoredReorders = (data).filter(item => item.is_ignored_reorder === 1)
        },
    },
    async mounted() {
        await this.getCsrfToken()
        if (this.isUserCanReadReorder)
            this.fetchReorder()
    }
}
</script>

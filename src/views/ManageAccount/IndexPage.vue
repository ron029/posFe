<template>
    <div style="padding: 0 20px">
        <h1>Manage Account</h1>

    </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';

export default {
    components: {},
    data: ()=>({

    }),
    computed: {
        ...mapGetters([])
    },
    watch: {

    },
    methods: {
        ...mapActions(['getCsrfToken']),

    },
    async mounted() {
        await this.getCsrfToken()

    }
}
</script>

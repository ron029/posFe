<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-data-table
        v-if="showTbl"
        :items="items"
        :headers="headers"
    ></v-data-table>
</template>

<script>

export default {
    props: ['show', 'items', 'headers'],
    computed: {
        showTbl() {
            return this.show
        }
    }
}
</script>

<style scoped>

</style>

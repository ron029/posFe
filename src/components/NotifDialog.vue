<template>
    <v-dialog
        v-model=showDialog
        width="400"
    >
        <v-card style="width: 400px">
            <v-card-title style="background-color: blue">&nbsp;</v-card-title>
            <v-card-text class="text-center" style="padding: 30px 0; font-size: 25px; height: 90px">
                {{ data.message }}
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['show', 'data'],
    computed: {
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.$emit('closeDialog')
            }
        }
    }
}
</script>

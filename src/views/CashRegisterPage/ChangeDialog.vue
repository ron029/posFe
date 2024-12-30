<template>
    <v-dialog
        v-model=showDialog
        width="400"
    >
        <v-card style="width: 400px">
            <v-card-title style="background-color: blue; color: white">Change Info</v-card-title>
            <v-card-text class="text-center" style="padding: 30px 0; height: 100%">
                <p style=" font-size: 30px; "><v-icon size="37" style="margin-bottom: 3px;">mdi-cash</v-icon> Change Due</p>
                <p style=" font-size: 50px; "><v-icon size="47" style="margin-bottom: 10px;">mdi-currency-php</v-icon> {{ change?.toFixed(2) }}</p>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['show', 'change'],
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

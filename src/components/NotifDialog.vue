<template>
    <v-dialog
        v-model=showDialog
        width="400"
        :persistent="persistent"
    >
        <v-card style="width: 400px">
            <v-card-title style="background-color: blue">&nbsp;</v-card-title>
            <v-card-text class="text-center" style="padding: 30px 0; font-size: 25px;">
                {{ data.message }}
                <v-btn
                    v-if="persistent"
                    @click="$router.push({name: 'login'})"
                    style="margin-top: 20px;"
                    color="success"
                >Relog in</v-btn>
                <slot name="action"></slot>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['show', 'data', 'persistent'],
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

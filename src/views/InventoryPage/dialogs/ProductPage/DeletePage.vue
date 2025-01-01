<template>
    <v-dialog v-model="showDialog">
        <v-card>
            <v-card-title color="error">Delete Product named "{{ data.item.name }}"?</v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" :loading="loading" @click="showDialog = false">cancel</v-btn>
                <v-btn color="error" :loading="loading" @click="deleteProduct">procceed</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data: () => ({
        loading: false,
    }),
    props: ['data', 'show'],
    computed: {
        ...mapGetters(['productDeleteData']),
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.$emit('closeDeleteDialog')
            }
        }
    },
    watch: {
        async productDeleteData(newVal) {
            this.loading = false
            this.$emit('closeDeleteDialog')
            if (newVal) {
                await this.getCsrfToken()
                this.products()
            }
        }
    },
    methods: {
        ...mapActions(['products', 'productDelete', 'getCsrfToken']),
        async deleteProduct() {
            this.loading = true
            await this.getCsrfToken()
            this.productDelete(this.data.item)
        },
    }
}
</script>

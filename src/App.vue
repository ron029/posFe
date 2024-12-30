<template>
  <v-app>
    <v-main>
        <router-view />
        <base-loading></base-loading>
        <NotifDialog
            v-if="$route.path !== '/'"
            :show="showDialog"
            :data="{message: 'Your session has timed out.'}"
            :persistent="true"
            @closeDialog="closeDialog"
        >
            <v-btn @click="forceLogin">Relog in</v-btn>
        </NotifDialog>
    </v-main>
  </v-app>
</template>

<script>
import store from './store';
import { mapGetters } from 'vuex';
import NotifDialog from './components/NotifDialog.vue'
import BaseLoading from "./components/BaseLoading";
export default {
    components: {
        NotifDialog,
        BaseLoading
    },
    data: () => ({
        showForceLogin: false
    }),
    computed: {
        ...mapGetters(['isUserTimeout']),
        showDialog: {
            get() {
                return this.isUserTimeout
            },
            set() {
                store.commit('IS_SESSION_EXPIRED', false)
            }
        }
    },
    methods: {
        closeDialog() {
            console.log('Please log in again.')
        },
        forceLogin() {
            this.showDialog = false
            if (this.$route.path !== '/') this.$router.push({name: 'login'})

        }
    },
    mounted() {
        console.log('page: ', this.$route.path)
    }
};
</script>

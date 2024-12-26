<template>
  <v-app>
    <v-main>
        <router-view />
        <base-loading></base-loading>
        <NotifDialog
            v-if="$router.path !== '/'"
            :show="showDialog"
            :data="{message: 'Your session has timed out.'}"
            @closeDialog="closeDialog"
        />
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
    computed: {
        ...mapGetters(['isUserTimeout']),
        showDialog: {
            get() {
                return this.isUserTimeout 
            },
            set() {
                store.commit('IS_SESSION_EXPIRED', false)
                this.$router.push({name: 'login'}) 
            }
        }
    },
    methods: {
        closeDialog() {
            console.log('Please log in again.')
        }
    },
    mounted() {
        console.log('page: ', this.$route.path)
    }
};
</script>

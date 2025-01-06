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
        ></NotifDialog>
        <CashRegisterTransactions
            v-if="$route.path !== '/'"
            :show="showCashRegisterRecorder"
            :mode="mode"
            @closeCashRegisterTransactions="showCashRegisterRecorder=false"
        />
    </v-main>
  </v-app>
</template>

<script>
import CashRegisterTransactions from './views/CashRegisterTransactions.vue';
import store from './store';
import { mapActions, mapGetters } from 'vuex';
import NotifDialog from './components/NotifDialog.vue'
import BaseLoading from "./components/BaseLoading";
export default {
    components: {
        NotifDialog,
        BaseLoading,
        CashRegisterTransactions,
    },
    data: () => ({
        sales: null,
        mode: 'in',
        valid: false,
        showCashRegisterRecorder: true,
        showForceLogin: false
    }),
    computed: {
        ...mapGetters(['isUserTimeout', 'registerCashFlowData', 'getExistingCashFlowData', 'fetchSalesBySessionData']),
        showDialog: {
            get() {
                return this.isUserTimeout
            },
            set() {
                store.commit('IS_SESSION_EXPIRED', false)
            }
        }
    },
    watch: {
        registerCashFlowData(newVal) {
            if (newVal.STATUS === 200) this.showCashRegisterRecorder = false
        }
    },
    methods: {
        ...mapActions(['getExistingCashFlow', 'fetchSalesBySession']),
        closeDialog() {
            console.log('Please log in again.')
        },
        forceLogin() {
            this.showDialog = false
            if (this.$route.path !== '/') this.$router.push({name: 'login'})
        }
    },
    mounted() {
        const cash_register_is_set = window.$cookies.get('cash_register_is_set')
        if (cash_register_is_set !== null && cash_register_is_set !== undefined  && cash_register_is_set === '1') {
            this.showCashRegisterRecorder = false
        } else {
            this.showCashRegisterRecorder = true
        }

        this.$eventBus.$on('showCashRegisterRecorder', (status) => {
            const register_cash_flow_id = Number(window.$cookies.get('cash_register_recorded_id'))
            this.fetchSalesBySession({ register_cash_flow_id })
            this.getExistingCashFlow({ register_cash_flow_id })
            this.mode = 'out'
            this.showCashRegisterRecorder = status
        });
    }
};
</script>

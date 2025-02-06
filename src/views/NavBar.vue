<template>
    <div style="height: 100%; vertical-align: top; font-size: 20px;">
        <v-card
            class="overflow-hidden mx-auto"
            height="100%"
            :style="`position: absolute; z-index: 5; display: ${this.$route.name === 'cash-register' ? 'none' : 'block'}`"
        >
            <v-navigation-drawer
                color="#D5B07E"
                permanent
                expand-on-hover
                :value="mainValue"
            >
                <div style="height: 200px;"></div>
                <v-list>
                    <v-list-item
                        v-for="([icon, text, url], i) in items"
                        :key="i"
                        link
                        @click="handleRoute(url)"
                    >
                        <v-list-item-icon> <v-icon>{{ icon }}</v-icon> </v-list-item-icon>
                        <v-list-item-content> <v-list-item-title>{{ text }}</v-list-item-title> </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-bottom-navigation
                    absolute
                    hide-on-scroll
                    horizontal
                    >
                    <!-- scroll-target="#hide-on-scroll-example" -->
                    <v-btn value="log-out" color="#D5B07E" @click="showCashRegisterRecorder">
                        <v-icon style="margin-left: 15px;">mdi-power</v-icon>
                    </v-btn>
                    <v-btn value="settings" color="#D5B07E">
                        <v-icon style="margin-left: 15px;">mdi-cog</v-icon>
                    </v-btn>
                    <v-btn value="account-settings" color="#D5B07E">
                        <v-icon style="margin-left: 15px;">mdi-account-cog</v-icon>
                    </v-btn>
                </v-bottom-navigation>
            </v-navigation-drawer>
        </v-card>
        <div :style="`margin-left: ${this.$route.name === 'cash-register' ? 0 : 60}px`">
            <router-view />
        </div>
    </div>
  </template>

<script>
import { mapActions, mapGetters } from 'vuex';

  export default {
    data: () => ({
        mainValue: null,
        value: 'recent',
        items: [
            ['mdi-view-dashboard', 'Dashboard', ''],
            ['mdi-cash-register', 'Cash Drawer', 'cash-register'],
            ['mdi-finance', 'Sales', 'sales'],
            ['mdi-warehouse', 'Inventory', `inventory`],
            ['mdi-reload-alert', 'Reorder Level', 'reorder'],
            ['mdi-account-group', 'Staff', 'staff'],
            ['', '', ''],
        ],
    }),
    computed: {
        ...mapGetters(['findUserRolePermissionData']),
    },
    methods: {
        ...mapActions(['findUserRolePermission']),
        showCashRegisterRecorder() {
            this.$eventBus.$emit('showCashRegisterRecorder', true)
        },
        handleRoute(url) {
            if (url) {
                if (this.$route.path !== `/pos/${url}`)
                    this.$router.push({name: url})
            }
        },
        handleKeyPress(event) {
            if (event.altKey && event.key === "d" || event.altKey && event.key === "D") {
                event.preventDefault()
                if (this.$route.path !== '/pos') this.$router.push('/pos')
            }
            if (event.altKey && event.key === "s" || event.altKey && event.key === "S") {
                console.log('SALES')
                event.preventDefault()
                if (this.$route.path !== '/pos/sales') this.$router.push('/pos/sales')
            }
            if (event.altKey && event.key === "c" || event.altKey && event.key === "C") {
                event.preventDefault()
                if (this.$route.path !== '/pos/cash-register') this.$router.push('/pos/cash-register')
            }
            if (event.altKey && event.key === "i" || event.altKey && event.key === "I") {
                event.preventDefault()
                if (this.$route.path !== '/pos/inventory') this.$router.push('/pos/inventory')
            }
        },
    },
    mounted() {
        // const permissions = window.$cookies.get('permissions')
        // console.log('permissions: ', JSON.parse(permissions.slice(2, permissions.length)))
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeyPress);
    },
  }
</script>

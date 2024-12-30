<template>
    <div style="height: 100%; vertical-align: top; font-size: 20px;">
        <v-card
            height="100%"
            :style="`position: absolute; z-index: 5; display: ${this.$route.name === 'cash-register' ? 'none' : 'block'}`"
        >
            <v-navigation-drawer
                color="#D5B07E"
                permanent
                expand-on-hover
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
            </v-navigation-drawer>
        </v-card>
        <div :style="`margin-left: ${this.$route.name === 'cash-register' ? 0 : 60}px`">
            <router-view />
        </div>
    </div>
  </template>

<script>
  export default {
    data: () => ({
      items: [
        ['mdi-view-dashboard', 'Dashboard', null],
        ['mdi-warehouse', 'Inventory', `inventory`],
        ['mdi-finance', 'Sales', null],
        ['mdi-account-group', 'Staff', null],
        ['mdi-cash-register', 'Cash Drawer', 'cash-register'],
        ['mdi-cog', 'Settings', null],
        ['mdi-account-cog', 'Account', null],
        ['', '', ''],
      ],
    }),
    methods: {
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
        window.addEventListener("keydown", this.handleKeyPress);
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeyPress);
    },
  }
</script>

<template>
    <div style="height: 100%; vertical-align: top; font-size: 20px;">
        <v-card
            height="100%"
            :style="`position: absolute; z-index: 5; display: ${this.$route.name === 'cash-register' ? 'none' : 'block'}`"
        >
        <!-- absolute
                dark
                color="#D5B07E"
                width="100%"
                permanent
                left
                expand-on-hover -->
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
                        @click="$router.push({name: url})"
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
        ['mdi-warehouse', 'Inventory', 'inventory'],
        ['mdi-finance', 'Transaction', null],
        ['mdi-account-group', 'Staff', null],
        ['mdi-cash-register', 'Cash Drawer', 'cash-register'],
        ['mdi-cog', 'Settings', null],
        ['mdi-account-cog', 'Account', null],
        ['', '', ''],
      ],
    }),
  }
</script>

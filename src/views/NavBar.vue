<template>
    <div style="height: 100%; vertical-align: top;">
        <v-card
            style="position: absolute"
            height="100%"
            width="300"
        >
            <v-navigation-drawer
                absolute
                dark
                color="#D5B07E"
                width="100%"
                permanent
                left
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
        <div style="margin-left: 300px;">
            <router-view />
        </div>
    </div>
  </template>

<script>
  export default {
    data: () => ({
      items: [
        ['mdi-email', 'DASHBOARD'],
        ['mdi-email', 'INVENTORY', 'inventory'],
        ['mdi-email', 'TRANSACTIONS'],
        ['mdi-email', 'ITEMS'],
        ['mdi-email', 'STAFF'],
        ['mdi-email', 'CASH DRAWER'],
        ['mdi-email', 'SETTINGS'],
        ['mdi-email', 'ACCOUNT'],
        ['', ''],
      ],
    }),
  }
</script>

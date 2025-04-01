<template>
    <div style="height: 100%; vertical-align: top; font-size: 20px;">
        <v-card
            class="overflow-hidden mx-auto"
            height="100%"
            :style="`position: absolute; z-index: 5; display: ${this.$route.name === 'cash-register' ? 'none' : 'block'}`"
        >
            <v-navigation-drawer
                color="#0092c1"
                permanent
                expand-on-hover
                :value="mainValue"
            >
                <div style="height: 200px;"></div>
                <v-list class="poppins-regular">
                    <v-list-item
                        v-for="([icon, text, url], i) in items"
                        :key="i"
                        link
                        @click="handleRoute(url)"
                    >
                        <v-list-item-icon>
                            <v-icon style="color: white;">{{ icon }}</v-icon>
                            <v-badge
                                v-if="url === 'reorder' && reorders && reorders.length>0"
                                color="red"
                                :content="reorders && reorders.length"
                            ></v-badge>
                        </v-list-item-icon>
                        <v-list-item-content> <v-list-item-title style="font-weight: 500; color: white;">{{ text }}</v-list-item-title> </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-bottom-navigation
                    absolute
                    hide-on-scroll
                    horizontal
                >
                    <v-btn style="width: 100%;" value="log-out" color="#0092c1" @click="showCashRegisterRecorder">
                        <v-icon style="margin-left: 15px;" class="white--text">mdi-power</v-icon>
                    </v-btn>
                    <v-btn style="width: 100%;" value="settings" color="#0092c1" @click="redirectToCompanyProfile">
                        <v-icon style="margin-left: 15px;" class="white--text">mdi-cog</v-icon>
                    </v-btn>
                    <v-btn v-show="true" value="account-settings" color="#0092c1" @click="redirectManageAccount">
                        <v-icon style="margin-left: 15px;" class="white--text">mdi-account-cog</v-icon>
                    </v-btn>
                </v-bottom-navigation>
            </v-navigation-drawer>
        </v-card>
        <div :style="`margin-left: ${this.$route.name === 'cash-register' ? 0 : 60}px`">
            <!-- Inner div with a background image -->
            <div
                v-show="this.$route.name !== 'cash-register'"
                :style="{
                    position: 'absolute',
                    backgroundImage: `url(${require('@/assets/img/20999.jpg')})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: `${this.$route.name === 'pos' ? '100%' : '50%'}`,
                    height: '100vh',
                    width: '100%',
                    zIndex: 0,
                }"
            ></div>
            <div style="z-index: 5; background-color: white;">
                <router-view />
            </div>
        </div>
    </div>
  </template>

<script>
import { mapActions, mapGetters } from 'vuex';

  export default {
    data: () => ({
        reorders: [],
        mainValue: null,
        value: 'recent',
        items: [
            ['mdi-view-dashboard', 'Dashboard', 'pos'],
            ['mdi-cash-register', 'Cash Drawer', 'cash-register'],
            ['mdi-finance', 'Sales', 'sales'],
            ['mdi-warehouse', 'Inventory', `inventory`],
            ['mdi-reload-alert', 'Reorder Level', 'reorder'],
            ['', '', ''],
        ],
    }),
    computed: {
        ...mapGetters(['findUserRolePermissionData', 'findUserRolePermissionData', 'fetchReorderData']),
        isUserCanReadReorder() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'reorder:1')
            return false
        },
        isUserCanUpdatePassword() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'self_pass:2')
            return false
        },
        isUserCanReadEmployee() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'employee:1')
            return false
        },
    },
    watch: {
        fetchReorderData(newVal) {
            if (newVal.STATUS === 200)
                this.setReorderAndIgnore(newVal.DATA)
        },
    },
    methods: {
        ...mapActions(['findUserRolePermission', 'fetchReorder', 'getCsrfToken']),
        setReorderAndIgnore(data) {
            this.reorders = (data).filter(item => item.is_ignored_reorder !== 1)
        },
        redirectManageAccount() {
            if (this.$route.path !== '/pos/manage-account')
                this.$router.push({name: 'manage-account'})
        },
        redirectToCompanyProfile() {
            if (this.$route.path !== '/pos/company-profile')
                this.$router.push({name: 'company-profile'})
        },
        showCashRegisterRecorder() {
            this.$eventBus.$emit('showCashRegisterRecorder', true)
        },
        handleRoute(url) {
            if (url) {
                if (url === 'cash-register') {
                    window.location.href = '/pos/cash-register'
                } else if (this.$route.path !== `/pos/${url}`) {
                    this.$router.push({name: url})
                }
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

            }
        },
    },
    async mounted() {
        if (window.$cookies.get('admin') === '1' || this.isUserCanReadEmployee) {
            const newElement = ['mdi-account-group', 'Staff', 'staff']
            this.items.splice(this.items.length - 1, 0, newElement);
        }
        if (window.$cookies.get('admin') === '1') {
            const newElement = ['mdi-account-cash', 'Account Cash', 'account-cash']
            this.items.splice(this.items.length - 1, 0, newElement);
        }
        await this.getCsrfToken()
        if (this.isUserCanReadReorder)
            this.fetchReorder()
        // const permissions = window.$cookies.get('permissions')
        // console.log('permissions: ', JSON.parse(permissions.slice(2, permissions.length)))
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeyPress);
    },
  }
</script>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'); */

.poppins-regular {
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-style: normal;
}
</style>

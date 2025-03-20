<template>
    <div>
        <v-card>
            <v-tabs
                v-model="tab"
                align-with-title
            >
                <v-tabs-slider color="#D5B07E"></v-tabs-slider>
                <v-tab
                    v-for="item in items"
                    :key="item"
                >
                    {{ item }}
                </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
                <v-tab-item
                    v-for="item in items"
                    :key="item"
                >
                    <v-card flat>
                    <v-card-text v-if="item=='reorder'">
                        <v-card>
                            <v-data-table
                                v-model="selected"
                                :headers="headers.reoders"
                                :items="reorders"
                                :search="search"
                                :show-select="isUserCanUpdateReorder()"
                                item-key="product_id"
                            >
                                <template slot="top">
                                    <v-row>
                                        <v-col cols="10">
                                            <v-text-field
                                                style="margin: 0 20px"
                                                v-model="searchQuery"
                                                @keyup.enter="search=searchQuery"
                                                placeholder="Search"
                                                append-icon="mdi-magnify"
                                                clearable
                                                @click:clear="search=''"
                                                @click:append="search=searchQuery"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="2"><v-btn :disabled="enableIgnore" color="success" large @click="show.ignore=true">ignore</v-btn></v-col>
                                    </v-row>
                                </template>
                                <template slot="item.notificatioStatus">
                                    <v-icon>mdi-bell</v-icon> Active
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-card-text>
                    <v-card-text v-if="item=='ignored'">
                        <v-card>
                            <v-data-table
                                :headers="headers.ignoredReorders"
                                :items="ignoredReorders"
                                v-model="selected"
                                :search="search"
                                :show-select="isUserCanUpdateReorder()"
                                item-key="product_id"
                            >
                                <template slot="top">
                                    <v-row>
                                        <v-col cols="10">
                                            <v-text-field
                                                style="margin: 0 20px"
                                                v-model="searchQuery"
                                                @keyup.enter="search=searchQuery"
                                                placeholder="Search"
                                                append-icon="mdi-magnify"
                                                clearable
                                                @click:clear="search=''"
                                                @click:append="search=searchQuery"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="2"><v-btn :disabled="enableIgnore" color="success" large @click="show.focus=true">Focus</v-btn></v-col>
                                    </v-row>
                                </template>
                                <template slot="item.notificatioStatus">
                                    <v-icon>mdi-bell-off</v-icon> Muted
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-card>
        <IgnorePage
            :show="show.ignore"
            :data="selected"
            @closeDialog="show.ignore=false"
            @ignoreProduct="ignoreProduct"
        />
        <FocusPage
            :show="show.focus"
            :data="selected"
            @closeDialog="show.focus=false"
            @enableNotification="enableNotification"
        />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import FocusPage from './FocusPage.vue';
import IgnorePage from './IgnorePage.vue';
export default {
    components: {
        FocusPage,
        IgnorePage
    },
    data () {
        return {
            show: {
                ignore: false,
                focus: false,
            },
            search: '',
            searchQuery: '',
            selected: [],
            tab: null,
            items: [ 'reorder', 'ignored' ],
            headers: {
                reoders: [
                    { text: 'Name', value: 'name' },
                    { text: 'Quantity', value: 'quantity' },
                    { text: 'Reorder Level', value: 'reorder_level' },
                    { text: 'Supplier', value: 'supplier' },
                    { text: 'Notification Status', value: 'notificatioStatus'},
                ],
                ignoredReorders: [
                    { text: 'Name', value: 'name' },
                    { text: 'Quantity', value: 'quantity' },
                    { text: 'Reorder Level', value: 'reorder_level' },
                    { text: 'Reason Ignored', value: 'reason' },
                    { text: 'Notification Status', value: 'notificatioStatus'},
                ]
            }
        }
    },
    props: ['reorders', 'ignoredReorders'],
    computed: {
        ...mapGetters(['findUserRolePermissionData']),
        enableIgnore() {
            return !this.selected.length>0
        }
    },
    watch: {
        tab() {
            this.searchQuery = ''
            this.selected = []
        },
        searchQuery(newVal) {
            if (newVal == '' || newVal == null || newVal == undefined) this.search = ''
        }
    },
    methods: {
        ...mapActions(['newReorder', 'destroyReorder']),
        isUserCanUpdateReorder() {
            const permissions = this.findUserRolePermissionData
            if (permissions) return permissions.some(item => item.name === 'reorder:2')
            return false
        },
        enableNotification(data) {
            console.log('enableNotification data: ', data)
            this.show.focus=false
            this.destroyReorder(data)
            this.selected = []
        },
        ignoreProduct(data) {
            console.log('ignoreProduct data: ', data)
            this.show.ignore = false
            this.newReorder(data)
            this.selected = []
        }
    }
};
</script>

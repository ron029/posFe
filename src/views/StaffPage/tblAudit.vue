<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-data-table
        v-if="showTbl"
        :items="items"
        :headers="headers"
        :sort-by="['created_at']"
        :sort-desc="[true]"
    >
        <template slot="item.action" slot-scope="{ item }">
            <v-chip :color="getColorFromName(getName(item.action))[0]"><span :style="`color: ${getColorFromName(getName(item.action))[1]}`">{{ getName(item.action) }}</span></v-chip>
        </template>
        <template slot="item.details" slot-scope="{ item }">
            <pre>{{ item.details.body }}</pre>
        </template>
        <template slot="item.created_at" slot-scope="{ item }">
            {{ formatDate(items.created_at) }}
        </template>
        <template slot="item.details.permission" slot-scope="{ item }">
            <v-icon :color="item.details.permission ? 'green' : 'red'">{{item.details.permission ? 'mdi-check-circle' : 'mdi-close-circle'}}</v-icon>
        </template>
    </v-data-table>
</template>

<script>
import moment from 'moment';


export default {
    props: ['show', 'items', 'headers'],
    computed: {
        showTbl() {
            return this.show
        },
    },
    methods: {
        getLabel(index) {
            let name = null
            switch(index) {
                case 0: name = 'create'
                    break
                case 1: name = 'read'
                    break
                case 2: name = 'update'
                    break
                case 3: name = 'delete'
                    break
            }
            return name
        },
        getName(permission) {
            const [name, action] = permission.split(':')
            const permissionLowerCase = `${name}: ${this.getLabel(Number(action))}`
            return permissionLowerCase.toUpperCase()
        },
        getColorFromName(name) {
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }

            // Generate a hex color
            const color = `#${(hash & 0xFFFFFF).toString(16).padStart(6, "0")}`;

            // Convert hex to RGB
            const r = parseInt(color.substring(1, 3), 16);
            const g = parseInt(color.substring(3, 5), 16);
            const b = parseInt(color.substring(5, 7), 16);

            // Calculate brightness using luminance formula
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;

            // Return color and appropriate text color
            return brightness > 128 ? [color, "black"] : [color, "white"];
        },
        formatDate(date) {
            return moment(date).format('MMMM D, YYYY HH:mm:ss')
        }
    }
}
</script>

<style scoped>

</style>

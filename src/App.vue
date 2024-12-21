<template>
  <v-app>
    <v-main>
        <router-view />
        <base-loading></base-loading>
    </v-main>
  </v-app>
</template>

<script>
import BaseLoading from "./components/BaseLoading";
export default {
    components: {
        BaseLoading
    },
};
</script>

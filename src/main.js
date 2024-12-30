import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router';
import store from "./store";
import axios from "./plugins/axios";
import VueCookies from 'vue-cookies';
import EventBus from './eventBus';

Vue.config.productionTip = false
Vue.use(VueCookies)
Vue.prototype.$eventBus = EventBus;

if (module.hot) {
    module.hot.accept((err) => {
        console.error("HMR failed:", err);
    });
}

new Vue({
  router,
  store,
  vuetify,
  axios,
  render: h => h(App)
}).$mount('#app')

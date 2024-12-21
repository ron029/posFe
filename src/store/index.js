import Vue from "vue";
import Vuex from "vuex";

import { authentication } from "./modules/auth";
import loading from "./modules/loading";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    authentication,
    loading,
  }
});

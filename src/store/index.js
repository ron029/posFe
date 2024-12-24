import Vue from "vue";
import Vuex from "vuex";

import { authentication } from "./modules/auth";
// import { dash } from './modules/dash'
import { product } from './modules/product';
import { unit } from './modules/unit';
import { brand } from './modules/brand';
import { category } from './modules/category';
import { supplier } from './modules/supplier';

import loading from "./modules/loading";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    authentication,
    // dash,
    product,
    unit,
    brand,
    category,
    supplier,
    loading,
  }
});

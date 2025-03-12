import Vue from "vue";
import Vuex from "vuex";

import { employee } from './modules/employee';
import { authentication } from "./modules/auth";
import { cashReg } from './modules/cashReg';
import { product } from './modules/product';
import { unit } from './modules/unit';
import { brand } from './modules/brand';
import { category } from './modules/category';
import { supplier } from './modules/supplier';
import { sales } from './modules/sales';
import { registerCashFlow } from './modules/cashFlow';
import { reorder } from './modules/reorder';
import { role } from './modules/role';
import { permission } from './modules/permission';
import { companyProfile } from "./modules/companyProfile";
import { productExpiration } from "./modules/productExpiration";

import loading from "./modules/loading";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    productExpiration,
    role,
    permission,
    employee,
    authentication,
    cashReg,
    product,
    unit,
    brand,
    category,
    supplier,
    loading,
    sales,
    registerCashFlow,
    reorder,
    companyProfile,
  }
});

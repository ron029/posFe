import axios from "axios";
// import router from "../router/index"
import store from "../store/";

const AXIOS = axios.create( {
    withCredentials: true,
    validateStatus: null,
    baseURL: process.env.VUE_APP_API
} );

AXIOS.interceptors.request.use((config) => {
  store.commit("loading/setLoading", true);
  return config;
});

// AXIOS.interceptors.request.use((request) => {
//   const now = moment();
//   if(parseInt(process.env.VUE_APP_MAINTENANCE_START) <= now.hour() && now.hour() <= parseInt(process.env.VUE_APP_MAINTENANCE_END)) {
//     router.push("/serverMaintenance");
//   }
//   return request;
// });

AXIOS.interceptors.response.use((response) => {
    console.log("intercepted");
    store.commit("loading/setLoading", false);
  if(response.status < 500) {
    console.log("Good Server Response");
    // if (response.status === 423) {
    //     console.log('Account Locked.')
    //     store.commit('IS_ACCOUNT_LOCKED', true)
    // }

    // if(response.status == 418) console.log("Server is a teapot.")

    // if (response.status == 401) store.commit('IS_SESSION_EXPIRED', true)

    return response;
  } else {
    // router.push("/serverError");
    throw true;
  }
}, (error) => {
    store.commit("loading/setLoading", false);
    console.error("Client Request Failedv");
    // router.push("/clientOffline");
    return Promise.reject(error);
});

export default AXIOS;

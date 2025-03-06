import COMPANY_PROFILE_API from "../APIs/companyProfile";

export const companyProfile = {
  state: {
    companyProfilesPutData: null,
    companyProfilesData: null,
  },
  actions: {
    companyProfilesPut({commit}, args) {
        try {
            COMPANY_PROFILE_API
            .companyProfilesPut(args)
            .then(res => {
                if (res.status === 200) {
                    commit('COMPANY_PROFILES_PUT', res.data)
                }
            })
        } catch (err) {
            commit('COMPANY_PROFILES_PUT', err.response)
            console.error(err)
        }
    },
    companyProfiles({commit}) {
        try {
            COMPANY_PROFILE_API
            .companyProfiles()
            .then(res => {
                if (res.status === 200) {
                    commit('COMPANY_PROFILES', res.data)
                }
            })
        } catch (err) {
            commit('COMPANY_PROFILES', err.response)
            console.error(err)
        }
    },
  },
  mutations: {
    COMPANY_PROFILES_PUT(state, companyProfilesPutData) {
        state.companyProfilesPutData = companyProfilesPutData
    },
    COMPANY_PROFILES(state, companyProfilesData) {
        state.companyProfilesData = companyProfilesData
    },
  },
  getters: {
    companyProfilesPutData(state) {
        return state.companyProfilesPutData
    },
    companyProfilesData(state) {
        return state.companyProfilesData
    },
  },
};

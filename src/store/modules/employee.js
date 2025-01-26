import EMPLOYEE_API from "../APIs/employee";

export const employee = {
  state: {
    employeeData: null,
    employeeFindData: null,
    employeePutData: null,
  },
  actions: {
    employeePut({commit}, args) {
        try {
            EMPLOYEE_API
                .employeePut(args)
                .then(res => {
                    commit('EMPLOYEE_PUT', res.data)
                })
        } catch (err) {
            commit('EMPLOYEE_PUT', err.response)
            console.error(err)
        }
    },
    employeeFind({commit}, args) {
        try {
            EMPLOYEE_API
                .employeeFind(args)
                .then(res => {
                    commit('EMPLOYEE_FIND', res.data)
                })
        } catch (err) {
            commit('EMPLOYEE_FIND', err.response)
            console.error(err)
        }
    },
    employee({commit}, args) {
        try {
            EMPLOYEE_API
                .employee(args)
                .then(res => {
                    commit('EMPLOYEE', res.data)
                })
        } catch (err) {
            commit('EMPLOYEE', err.response)
            console.error(err)
        }
    },
  },
  mutations: {
    EMPLOYEE_PUT(state, employeePutData) {
        state.employeePutData = employeePutData
    },
    EMPLOYEE_FIND(state, employeeFindData) {
        state.employeeFindData = employeeFindData
    },
    EMPLOYEE(state, employeeData) {
        state.employeeData = employeeData
    },
  },
  getters: {
    employeePutData(state) {
        return state.employeePutData
    },
    employeeFindData(state) {
        return state.employeeFindData
    },
    employeeData(state) {
        return state.employeeData
    },
  },
};

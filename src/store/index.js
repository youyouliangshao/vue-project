import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        token: "",
        empAccount: "",
        empName: "",
        spread: '',
    },
    mutations: {
        updateEmpInfo(state, obj) {
            state.token = obj.token;
            state.empAccount = obj.empAccount;
            state.empName = obj.empName;
        },
        isCollapse(state, spreadState) {
            state.spread = spreadState
        },
    }
})

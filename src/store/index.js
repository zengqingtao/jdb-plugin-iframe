import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import { getCookie } from "@/utils/cookie";

Vue.use(Vuex);
const state = {
    _account: '',
    _token: '',
    _skuId: '',
    _QRcodeUrl: '',
};

export default new Vuex.Store({
    state,
    actions,
    mutations
})
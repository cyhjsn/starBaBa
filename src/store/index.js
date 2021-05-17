import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    shopbagCount: 0,
    isLoadShopbagCount: false
  },

  mutations: {
    changeShopbagCount(state, data) {

      state.shopbagCount = data;
    },

    changeIsLoadShopbagCount(state, data) {
      state.isLoadShopbagCount = data;
    }
  }
})
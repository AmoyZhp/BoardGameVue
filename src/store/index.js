import Vue from 'vue'
import Vuex from 'vuex'
import gomoku from '@/store/modules/gomoku/index'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
      gomoku,
  },
  strict: true,
})

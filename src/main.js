import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/axios'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios"

Vue.config.productionTip = false
axios.defaults.baseURL = "127.0.0.1:8181"
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

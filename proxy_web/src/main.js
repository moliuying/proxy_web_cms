// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Meta from 'vue-meta'
Vue.use(Meta)

import { Ajax } from './config/api'
Vue.prototype.Ajax = Ajax

Vue.config.productionTip = false
import moment from "moment"
Vue.prototype.moment = moment

import 'view-design/dist/styles/iview.css'

import store from './store'
/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})

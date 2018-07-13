// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './assets/js/validate.js';
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/common.css'
import axios from 'axios'
import VueCookie from 'vue-cookie'
import common from './assets/js/common'
import echarts from 'echarts'
Vue.config.productionTip = false;
Vue.prototype.axios = axios;
Vue.prototype.$echarts = echarts;
Vue.use(Vuex);
Vue.use(Element);
Vue.use(VueCookie);
window.common = common
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
    //App的定义组件  导入index.html的APP标签
  components: { App }
});

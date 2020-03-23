import Vue from 'vue'
import App from './App.vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import store from './store'

import './styles/index.scss'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')

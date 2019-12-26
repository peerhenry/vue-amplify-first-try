import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import API from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub'
import awsconfig from './aws-exports'
API.configure(awsconfig)
PubSub.configure(awsconfig)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

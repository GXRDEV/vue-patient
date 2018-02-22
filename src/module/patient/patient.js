import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import App from './Modules'
import FastClick from 'fastclick'
import { vuxs } from './store/modules/vuxs'
import { sync } from 'vuex-router-sync'
import { weChatConfig, routerEach } from './router/router'
// import Navigation from 'vue-navigation'
import http from '@plugins/ajax/http'
import urls from '@plugins/url'

Vue.use(http)
Vue.use(urls)
Vue.use(Router)

store.registerModule('vux', vuxs)

// plugins
import { ToastPlugin, AlertPlugin, ConfirmPlugin, LoadingPlugin, WechatPlugin } from 'vux'
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(WechatPlugin)

weChatConfig(Vue, store)

FastClick.attach(document.body)

const patientRoutes = []

const router = new Router({
  routes: patientRoutes
})

// Vue.use(Navigation, { router, store })

sync(store, router)

routerEach(store, router, Vue)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')


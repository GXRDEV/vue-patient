import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import shop from './modules/shop'
import shopCart from './modules/shopCart'

import createLogger from '../../../plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    shopCart
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

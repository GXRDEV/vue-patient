import Vue from 'vue'
import * as types from './mutation-types'

export default {
  [types.GET_DISTCODES](state, { items }) {
    Vue.set(state, 'distcodes', [...items.map((item, idx) => {
      return {
        name: item.distName,
        value: item.distCode,
        parent: item.distCode.lastIndexOf('0000') == 2 ? 0 : item.distCode.lastIndexOf('00') == 4 ? (item.distCode.substr(0, 2) + '0000') : (item.distCode.substr(0, 4) + '00')
      }
    })])
  },
  [types.SET_STATE](state, { logintype = 0, openid } = {}) {
      state.logintype = logintype
      state.openid = openid
      sessionStorage.setItem('_openid', openid)
  },
  [types.SET_WXINFO](state, { uinfo = {}, uwr = {} } = {}) {
      state.uinfo = { ...state.uinfo, ...uinfo }
      state.uwr = { ...state.uwr, ...uwr }
      state.userid = uwr.userId
  },
  [types.SET_KEEPSTATE](state, { keepAlive = false } = {}) {
      state.keepAlive = keepAlive
  },
  [types.SET_GPS](state, { ...gps }) {
      state.gps = gps
  },
  [types.SET_SGPS](state, { ...gps }) {
      state.sgps = gps
  },
  [types.SET_GOEASY](state, { key }) {
      state.goeasy = key
  }
}

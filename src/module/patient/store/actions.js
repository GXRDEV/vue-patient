import * as api from '../api'
import * as types from './mutation-types'
import { querystring } from 'vux'
import GetGoEasy from '@plugins/ajax/GetGoEasy'

export const getDistCodes = ({ commit }) => {
    return new Promise((resolve, reject) => {
        api.getDistCode(items => {
          commit(types.GET_DISTCODES, { items })
          resolve()
        })
    })
}

export const updateUserInfo = ({ commit, state }, oid = '') => {
    // 获取用户信息，并添加goeasy全局监听
    api.getWXInfo(oid).then(d => {
      if (!(d.uwr && d.uwr.userId)) return
      commit(types.SET_WXINFO, {
        uinfo: d.uinfo,
        uwr: d.uwr
      })
      GetGoEasy('patient_' + d.uwr.userId, message => {
          // console.log('我的goeasy-msg:', message)
          let key = ''
          let time = +new Date()
          let json = JSON.parse(message.content)

          if (json.content && json.content.pushCode) {
            key = 'messageNotify:' + time
          } else if (json.type == 'rongCloudNotify') {
            key = 'rongCloudNotify_' + time
          }
          key && commit(types.SET_GOEASY, { key })
      })
  })
}

export const isLogin = ({ dispatch, commit, state }, { sceneStr = '' } = {}) => {
  return new Promise((resolve, reject) => {
      let { openid, code } = querystring.parse()
      let _openid = state.openid || openid

      function isBind(oid = '') {
        api.isBind(oid, sceneStr).then(d => {
          let isbind = d.isbind == true
          let issub = d.subscribe == '1'
          commit(types.SET_STATE, {
            logintype: isbind && issub,
            openid: oid
          })
          resolve(issub ? isbind ? { logined: true } : { needbind: true } : { needwatch: d.erweimaUrl })
        })
        !state.userid && oid && dispatch('updateUserInfo', oid)
      }

      if (state.logintype) {
        !state.userid && _openid && dispatch('updateUserInfo', _openid)
        resolve({ logined: true })
      } else if (_openid) {
        isBind(_openid)
      } else if (code) {
        api.getOpenid(code).then(d => {
          d && d.openid ? isBind(d.openid) : alert('获取信息失败')
        })
      } else {
        resolve({ needauth2: true })
      }
  })
}

export const getGPS = ({ commit, state }, res) => {
  let { latitude, longitude } = res
  api.getGPS(latitude, longitude, (code, name) => {
    commit(types.SET_GPS, {
      code,
      name,
      lat: latitude,
      lon: longitude
    })
  })
}

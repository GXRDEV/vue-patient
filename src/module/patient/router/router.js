import * as types from '../store/mutation-types'

function weChatConfig (Vue, store) {
    const hrf = location.href.split('#')[0]
    const wx = Vue.wechat
    const urls = Vue.urls
    if (hrf.indexOf('from=singlemessage&isappinstalled=0') !== -1) {
        return location.replace(location.href.replace('from=singlemessage&isappinstalled=0', '1=1'))
    }
    Vue.http.get(urls.GAINSHAREPARAMS, { shareurl: hrf }).then((res) => {
        const cfg = Object.assign(res, {
            jsApiList: [
                'hideAllNonBaseMenuItem',
                'showMenuItems',
                'onMenuShareAppMessage',
                'onMenuShareTimeline',
                'showAllNonBaseMenuItem',
                'onMenuShareQQ',
                'hideMenuItems',
                'getLocation',
                'previewImage',
                'chooseImage',
                'uploadImage',
                'getLocalImgData',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'onVoicePlayEnd',
                'uploadVoice',
                'chooseWXPay',
                'closeWindow',
                'openAddress'
            ]
        })
        wx.config(cfg)
        wx.ready(() => {
            wx.hideAllNonBaseMenuItem()
            wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                    store.dispatch('getGPS', res)
                },
                fail: function (res) {
                    store.commit(types.SET_GPS, {
                        code: '',
                        name: '定位失败',
                        lat: '',
                        lon: ''
                    })
                }
            })
        })
    })
}

function routerEach (store, router, Vue) {
    router.beforeEach((to, from, next) => {
        store.commit('updateLoadingStatus', {isLoading: true})
        if (/\:\/\//.test(to.path)) {
            let urlPath = to.fullPath.split('://')[1]
            window.location.href = 'https://' + urlPath
        } else {
            store.dispatch('isLogin', { sceneStr: to.name && to.params.id ? [to.name, to.params.id].join('_') : '' }).then(res => {
                if (res.logined || to.matched.some(record => record.meta.ignoreAuth)) {
                    // 已经登录过或者不需要授权和绑定
                    next()
                } else if (res.needauth2) {
                    // 需要授权，默认所有不需要绑定
                    next({ path: '/auth2', query: { from: to.fullPath } })
                } else if (res.needwatch) {
                    // 需要关注公号
                    next({ path: '/watch', query: { url: res.needwatch } })
                } else if (res.needbind && to.matched.some(record => record.meta.needBind)) {
                    // 需要绑定
                    next({ path: '/bind', query: { from: to.fullPath } })
                } else {
                    next()
                }
            })
        }
    })

    const wx = Vue.wechat
    router.afterEach(route => {
        store.commit('updateLoadingStatus', { isLoading: false })
        wx.ready(() => {
            wx.hideAllNonBaseMenuItem()
        })
    })
}

export {
    weChatConfig, routerEach
}

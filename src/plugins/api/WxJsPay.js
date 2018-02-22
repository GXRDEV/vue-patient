const checkWX = function () {
    let wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)
    if (!wechatInfo) {
        alert('仅支持在微信里面打开')
        return false
    } else if (wechatInfo[1] < '5.0') {
        alert('您的微信版本（V ' + (wechatInfo[1] || '4.0') + '）比较低，不支持微信支付。请升级您的微信。')
        return false
    }
    return true
}
/**
 * 微信支付调用接口
 * @param {Object} config 微信支付参数
 * @param {Function} ok 支付成功回调
 * @param {Function} cancel 支付取消回调
 * @param {Function} fail 支付接口调用错误回调
 */
/* export default function (config, ok, cancel, fail) {
    const jsApiCall = function () {
        /*global WeixinJSBridge */
        /* WeixinJSBridge.invoke('getBrandWCPayRequest', {...config, signType: 'MD5', paySign: config.sign},
            function (res) {
                res.err_msg.indexOf(':ok') > -1 && (typeof ok === 'function' ? ok(res) : alert('支付成功'))
                res.err_msg.indexOf(':cancel') > -1 && (typeof cancel === 'function' ? cancel(res) : console.log('用户已取消'))
                res.err_msg.indexOf(':fail') > -1 && (typeof fail === 'function' ? fail(res) : alert('支付失败：' + JSON.stringify(res)))
            }
        )
    }
    if (!checkWX()) return false
    if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', jsApiCall, false)
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', jsApiCall)
            document.attachEvent('onWeixinJSBridgeReady', jsApiCall)
        }
    } else {
        jsApiCall()
    }
}*/
export default function (vue, config, ok, cancel, fail) {
    if (!checkWX()) return false
    let wx = vue.$wechat
    wx.chooseWXPay({
        timestamp: config.timeStamp,
        nonceStr: config.nonceStr,
        package: config.package,
        signType: 'MD5',
        paySign: config.sign,
        success: function (res) {
            typeof ok === 'function' ? ok(res) : alert('支付成功')
        },
        cancel: function (res) {
            typeof cancel === 'function' ? cancel(res) : console.log('用户已取消')
        },
        fail: function (res) {
            typeof fail === 'function' ? fail(res) : alert('支付失败：' + JSON.stringify(res))
        }
    })
}

const age = (() => {
    let arr = []
    for (let i = 1; i <= 120; i++) { arr.push({ value: i + '', name: i + '岁' }) }
    return arr
})()

let config = require('../../../../config')
let assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsPublicPath + config.build.assetsSubDirectory
    : config.dev.assetsPublicPath + config.dev.assetsSubDirectory

export default {
    static: assetsSubDirectory,
    wechat: navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i),
    ios: !!navigator.userAgent.match(/(i[^;]+\;(U;)? CPU.+Mac OS X)/),
    android: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1,
    keepAlive: false,
    logintype: false,
    openid: sessionStorage.getItem('_openid') || '',
    userid: '',
    code: '',
    uinfo: null,
    uwr: null,
    goeasy: '',
    age,
    sex: [
        { value: '1', name: '男' },
        { value: '2', name: '女' }
    ],
    diagnosis: [
        { value: '1', name: '初诊' },
        { value: '0', name: '复诊' }
    ],
    distcodes: [],
    gps: {
        lat: '',
        lon: '',
        code: '',
        name: '未定位'
    },
    sgps: {
        lat: '',
        lon: '',
        code: '',
        name: ''
    },
    pullupConfig: {
        content: '上拉加载更多',
        downContent: '松开进行加载',
        upContent: '上拉加载更多',
        loadingContent: '加载中...',
        pullUpHeight: 20
    },
    orderType: {
        '1': '图文问诊',
        '2': '电话问诊',
        '4': '远程会诊',
        '5': '图文会诊',
        '6': '图文问诊',
        '7': '电话问诊',
        '8': '患者报到',
        '9': '快速问诊',
        '10': '转诊服务',
        '11': '会诊申请',
        '11-5': '图文会诊申请',
        '11-4': '视频会诊申请',
        '12': '团队问诊',
        '13': '送心意',
        '14': '团队vip',
        '15': '家庭医生',
        '99': '随访'
    },
    orderState: {
        '10': '待接诊',
        '20': '问诊中',
        '25': '待复诊',
        '30': '已退诊',
        '40': '已完成',
        '50': '已取消'
    },
    drugState: {
        '10': '已付款，待配送',
        '20': '已付款，配送中',
        '30': '订单失败',
        '40': '已收货',
        '50': '已取消'
    }
}

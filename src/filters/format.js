
/**
 * 格式化时间new Date
 * @param {String} val 格式化时间一般为时间戳
 * @param {String} fmt 格式，比如：yyyy-MM-dd hh:mm:ss.S
 * @param {Boolean} auto 是否开启自动转换，转换成当前不带日期的
 */
export default function (val, fmt = 'yyyy-MM-dd hh:mm:ss', auto = true) {
    val = new Date(val.toString().indexOf('-') != -1 ? val.replace(new RegExp(/-/gm), '/') : val)
    let now = new Date()
    let c = {
        'y+': now.getFullYear(),
        'M+': now.getMonth() + 1,
        'd+': now.getDate()
    }
    let o = {
        'M+': val.getMonth() + 1, // 月份
        'd+': val.getDate(), // 日
        'h+': val.getHours(), // 小时
        'm+': val.getMinutes(), // 分
        's+': val.getSeconds(), // 秒
        'q+': Math.floor((val.getMonth() + 3) / 3), // 季度
        'S': val.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
        let year = (val.getFullYear() + '').substr(4 - RegExp.$1.length)
        fmt = fmt.replace(RegExp.$1, auto ? (c['y+'] != year ? year : '') : year)
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            let val = (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))
            if (k in ['M+', 'd+']) {
                fmt = fmt.replace(RegExp.$1, auto && c['y+'] != o['y+'] ? val : '')
            } else {
                fmt = fmt.replace(RegExp.$1, val)
            }
        }
    }
    let num = 0
    return fmt.split('').map(item => {
        let isnum = parseInt(item, 10) >= 0
        return num ? item : isnum ? (num++, item) : ''
    }).join('')
}

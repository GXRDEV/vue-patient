/**
 * 格式化倒计时的格式
 * @param {Number} val 倒计时间，单位秒
 * @param {String} fmt 格式，比如：mm′ ss″
 */
export default function (val, fmt) {
    let nDate = new Date(val * 1000)
    let o = {
        'y+': nDate.getFullYear() - 1970,
        'M+': nDate.getMonth(), // 月份
        'd+': nDate.getDate() - 1, // 日
        'h+': nDate.getHours() - 8, // 小时
        'm+': nDate.getMinutes(), // 分
        's+': nDate.getSeconds(), // 秒
        'S': nDate.getMilliseconds() // 毫秒
    }
    let oo = {
        'y+': 12,
        'M+': 30,
        'd+': 24,
        'h+': 60, // 小时
        'm+': 60, // 分
        's+': 1000 // 秒
    }
    let prev = 0
    let i = 0
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            let ok = o[k] + ''
            !i && (ok = (prev + o[k]) + '', i++)
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? ok : ok.length > 2 ? ok : (('00' + ok).slice(-2)))
        }
        !i && (prev = (prev + o[k]) * oo[k])
    }
    return fmt
}

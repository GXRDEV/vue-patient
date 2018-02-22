/**
 * 将真实电话号码遮掩
 * @param {*} val 电话号码
 */
export default function (val, def) {
    val = [val].join('')
    if (val.length == 11) {
        return val.substr(0, 3) + '****' + val.substr(7, 4)
    } else if (val.length > 2) {
        return val.substr(0, 1) + '***' + val.substr(val.length - 1, 1)
    } else if (val) {
        return val.substr(0, 1) + '*'
    } else {
        return def || '匿名用户'
    }
}

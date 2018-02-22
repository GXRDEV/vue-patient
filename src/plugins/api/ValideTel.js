
/**
 * 验证电话号码是否有效
 * @param {TelNumber} text 电话号码
 */
export default function (text) {
    text = (text + '').replace(/^\s*|\s*$/g, '')
    let _d = /^1[3578][01379]\d{8}$/g
    let _l = /^1[34578][01245678]\d{8}$/g
    let _y = /^(134[012345678]\d{7}|1[34578][012356789]\d{8})$/g
    if (_d.test(text)) {
        return true
    } else if (_l.test(text)) {
        return true
    } else if (_y.test(text)) {
        return true
    }
    return false
}

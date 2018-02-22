
/**
 * 邮件验证
 * @param {String} text 邮件
 */
export default function (text) {
    let _emp = /^\s*|\s*$/g
    text = text.replace(_emp, '')
    let _d = /[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}\.[a-zA-Z0-9]{1,5}/
    if (_d.test(text)) {
        return true
    }
    return false
}

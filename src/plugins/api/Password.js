/**
 * 验证密码格式
 */
export default function (text) {
    let pass = /^(?=.{6,18}$)[0-9a-zA-Z]+$/g
    if (pass.test(text)) {
        return true
    } else {
        return false
    }
}

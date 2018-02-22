/**
 * 判断是否是微信录音本地id
 * @param {URL} str 地址
 */
export default function (str = '') {
    return str.indexOf('wxLocalResource://') != -1 || str.indexOf('weixin://') != -1
}

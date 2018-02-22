/**
 * 判断是否是在线地址
 * @param {URL} str 地址
 */
export default function (str) {
    return str.indexOf('http://') != -1 || str.indexOf('https://') != -1
}

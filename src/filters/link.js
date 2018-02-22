
/**
 * 修复异步数据的url地址
 * @param {URL} str 异步地址
 */
export default function (str) {
    return str || location.hash.replace('#', '')
}

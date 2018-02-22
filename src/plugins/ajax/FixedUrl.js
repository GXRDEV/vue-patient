let config = require('../../../config')
let target = process.env.NODE_ENV === 'production'
    ? config.build.target
    : config.dev.target
/**
 * 修复异步数据的url地址
 * @param {URL} str 异步地址
 */
export default function(str) {
    if (str.slice(0, 1) == '/') {
        return str
    } else if (str.indexOf('drug/') != -1) {
      return target + '/' + str
    } else {
        return target + '/d2p/' + str
    }
}

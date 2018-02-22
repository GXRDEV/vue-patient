/**
 * 补全图片的地址
 * @param {String} val 图片地址
 * @param {*} type 图片不存在的默认地址,类型
 * @param {Number} thumbsize 缩略图尺寸
 * @param {String} thumbtype 缩略图类型，m_fill（将图自动裁剪成宽度为100，高度为100的效果图），m_lfit（按长边优先）
 */
let config = require('../../config')
let assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsPublicPath + config.build.assetsSubDirectory
    : config.dev.assetsPublicPath + config.dev.assetsSubDirectory
export default function(val, type = 'doc', thumbsize = 60, thumbtype = 'm_fill') {
    let src = `${assetsSubDirectory}/${type}` + (type.indexOf('.') != -1 ? '' : '.png')
    if (!val || val == 'null') return src

    if (val.indexOf('http://') != -1) {
        src = location.href.indexOf('https://') != -1 ? val.replace('http://', 'https://') : val
    } else if (val.indexOf('https://') != -1 || val.indexOf('blob:http') != -1) {
        src = val
    } else if (val.indexOf('data:image/') != -1 || val.indexOf('wxLocalResource://') != -1 || val.indexOf('weixin://') != -1) {
        src = val
    }

    if (src.indexOf('aliyuncs.com') == -1) {
        thumbsize = 'auto'
    }
    return src + (thumbsize == 'auto' ? '' : '?x-oss-process=image/resize,' + thumbtype + ',h_' + thumbsize + ',w_' + thumbsize)
}

/**
 * 转化诊断类型为中文
 * @param {Number} type 诊断类型编码
 */
export default function (type) {
    return type == 1 ? '初诊' : type == 0 ? '复诊' : ''
}

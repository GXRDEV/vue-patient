/**
 * 转化性别为中文
 * @param {Number} sex 性别编码
 */
export default function (sex) {
    return sex == 1 ? '男' : sex == 2 ? '女' : ''
}

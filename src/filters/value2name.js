/**
 * 将值转换为名字，vux移植更改的
 * @param {*} value 要转化的值
 * @param {*} list 从这个列表中查找
 * @param {*} delimiter 间隔符
 */
export default function (value, list, delimiter) {
  if (value && !list.length) {
    return ''
  }
  if (!delimiter) {
    delimiter = ' '
  }

  let rs = value.map((one, index) => {
    if (list.length && Object.prototype.toString.call(list[0]) === '[object Array]') {
      return list[index].find(item => {
        return item.value === one
      })
    } else {
      return list.find(item => {
        return item.value === one
      })
    }
  })

  return rs.map(one => {
    return one ? one.name : one
  }).join(delimiter).replace('--', '')
}

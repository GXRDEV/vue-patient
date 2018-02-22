import ValideCard from './ValideCard'

/**
 * 从身份证号内提取信息
 * @param {*} text 身份证号
 */
export default function (text) {
    if (!ValideCard(text)) {
        return {}
    }
    let sex
    let age
    let sexcode
    let year = text.substring(6, 10)
    let gmonth = text.substring(10, 12)
    let gday = text.substring(12, 14)
    let myDate = new Date()
    let month = myDate.getMonth() + 1
    let day = myDate.getDate()
    if (parseInt(text.substr(16, 1)) % 2 == 1) {
        sex = '男'
        sexcode = '1'
    } else {
        sex = '女'
        sexcode = '2'
    }
    age = myDate.getFullYear() - text.substring(6, 10) - 1
    if (gmonth < month || gmonth == month && gday <= day) { age++ }
    return { birth: year + '-' + gmonth + '-' + gday, sex: sex, age: age + '', sexcode: sexcode }
}

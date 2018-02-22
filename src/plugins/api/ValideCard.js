/**
 * 验证中国公民身份证号
 * @param {String} idCard 身份证号
 */
export default function (idCard) {
    let regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
    let HMCard = /^[HhMm]\d{8}((\(\d{2}\))|\d{2})$/
    let TCard = /^\d{8}(\d{1,2}(\([A-Za-z]\))?)?$/
    switch (idCard.length) {
        // case 8:
        // case 9:
        // case 10:
        // case 11:
        // case 13:
        //     if (HMCard.test(idCard)) { return true }
        //     if (TCard.test(idCard)) { return true }
        //     return false
        case 18:
            if (regIdCard.test(idCard)) {
                let idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 将前17位加权因子保存在数组里
                let idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
                let idCardWiSum = 0 // 用来保存前17位各自乖以加权因子后的总和
                for (let i = 0; i < 17; i++) {
                    idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i]
                }
                let idCardMod = idCardWiSum % 11 // 计算出校验码所在数组的位置
                let idCardLast = idCard.substring(17) // 得到最后一位身份证号码
                if (idCardMod == 2) {
                    if (idCardLast == 'X' || idCardLast == 'x') {
                        return true
                    } else {
                        return false
                    }
                } else {
                    if (idCardLast == idCardY[idCardMod]) {
                        return true
                    } else {
                        return false
                    }
                }
            }
            break
        default:
            return false
    }
}

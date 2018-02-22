/**
 * 送心意颜色
 * @param {String} item 心意名称
 */
export default function (item) {
    switch (item) {
        case '一点心意': return 'color: #acd598'
        case '白衣天使': return 'color: #0086d1'
        case '医德高尚': return 'color: #f19ec2'
        case '德艺双馨': return 'color: #f6ab00'
        case '华佗在世': return 'color: #d22432'
    }
}

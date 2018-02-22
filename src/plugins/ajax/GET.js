import $ from 'axios'
import FixedUrl from './FixedUrl'

export default function (url, data = {}, that) {
    return new Promise((resolve, reject) => {
        $.get(FixedUrl(url), { params: data })
        .then(response => {
            response.data ? resolve(response.data) : reject()
        })
        .catch(response => {
            reject()
            if (that) {
                'scroll' in that && that.scroll.pullupStatus == 'loading' && (that.scroll.pullupStatus = 'default')
                '$vux' in that && (that.$vux.loading.hide(), that.$vux.toast.text('数据出错，请检查或者通知管理员'))
            }
        })
    })
}

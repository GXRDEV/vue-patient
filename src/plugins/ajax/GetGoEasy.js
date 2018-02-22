import AppendScript from './AppendScript'

function newGoeasy (channelId, resolve) {
    let goEasy = new GoEasy({
        appkey: '78028e7e-edcc-4524-b56b-45639785a53a',
        onConnected () {
            // console.log('---GoEasy加载完成----' + new Date())
        }
    })
    goEasy.subscribe({
        channel: channelId,
        onMessage: resolve,
        onSuccess () {
            console.log('监听【' + channelId + '】成功。' + new Date())
        },
        onFailed () {
            console.log('监听【' + channelId + '】失败。' + new Date())
        }
    })
}

/**
 * goeasy推送侦听
 * @param {String} 频道id
 */
export default function (cid, resolve) {
    /*global GoEasy */
    if (typeof GoEasy != 'undefined') {
        newGoeasy(cid, resolve)
    } else {
        AppendScript('https://cdn.goeasy.io/goeasy.js', function () {
            newGoeasy(cid, resolve)
        })
    }
}

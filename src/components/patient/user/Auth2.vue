<template></template>
<script>
let config = require('../../../../config')
let appid = process.env.NODE_ENV === 'production' ? config.build.appid : config.dev.appid
export default {
    beforeRouteEnter (to, from, next) {
        let fromUrl = encodeURIComponent(`${location.origin.replace('51zjh', 'ebaiyihui') + location.pathname}#${to.query.from || '/'}`)
        let link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${fromUrl}&response_type=code&scope=snsapi_base&state=2017#wechat_redirect`
        next(link)
    }
}
</script>

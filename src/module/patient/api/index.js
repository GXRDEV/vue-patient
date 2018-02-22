import { GET } from '@plugins/ajax'
import { GAINSYSAREA, GAINOPENIDBYCODE, TELLBIND, GAINLOCATIONINFO, GAINPERSONINFO } from '@plugins/url/url.api'

export function getDistCode (fn) {
    GET(GAINSYSAREA, {
        type: 0,
        parentCode: ''
    }).then(data => {
        fn(data.dists || [])
    })
}

export function getOpenid (code) {
    return GET(GAINOPENIDBYCODE, { code })
}

export function isBind (openid, sceneStr) {
    return GET(TELLBIND, { openid, sceneStr })
}

export function getWXInfo (openid) {
    return GET(GAINPERSONINFO, { openid })
}

export function getGPS (latitude, longitude, fun) {
    GET(GAINLOCATIONINFO, {
        latitude, longitude
    }).then(function (d) {
        fun(d.distCode || '', d.city || '')
    })
}

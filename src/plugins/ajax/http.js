import get from './GET'
import post from './POST'

const http = {
    get,
    post
}

const plugin = {
  install (Vue) {
    Vue.prototype.$http = http
    Vue.http = http
  },
  $http: http
}

export default plugin
export const install = plugin.install

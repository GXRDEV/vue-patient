import * as urls from './url'
// import * as urls from './url.new'

const plugin = {
  install (Vue) {
    Vue.prototype.$urls = urls
    Vue.urls = urls
  },
  $urls: urls
}

export default plugin
export const install = plugin.install

// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/module/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static/v2',
    assetsPublicPath: '/', //root里面时就没有/wx，在100目录下就是/100/.
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    //是否启用gzip 压缩
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    target: 'https://develop.ebaiyihui.com:8443',  //https://develop.ebaiyihui.com:8443 // https://weixin.ebaiyihui.com
    //target: 'http://localhost:8090',
    appid: 'wx0369e0fca6790259' // wx4ee3ae2857ad1e18 : 佰医汇
  },
  dev: {
    appid: 'wx0369e0fca6790259', // 康信医疗
    env: require('./dev.env'),
    port: 8000,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static/v2',
    assetsPublicPath: '/',
    proxyTable: {
      '/d2p': {
        target: 'https://develop.ebaiyihui.com:8443',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/d2p': '/d2p'
        }
      },
      '/drug': {
        target: 'https://develop.ebaiyihui.com:8443',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/drug': '/drug'
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    target: ''
  }
}

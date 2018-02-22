var path = require('path')
var fs = require('fs')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var entrys = require('./getentry')
const routePath = path.resolve(__dirname, '../src/module/patient/router/router.json')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const webpackConfig = {
  entry: entrys.js,
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js',
    chunkFilename: '[name].pie.js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      '@assets': resolve('src/assets'),
      '@components': resolve('src/components'),
      '@filters': resolve('src/filters'),
      '@patient': resolve('src/components/patient'),
      '@directives': resolve('src/directives'),
      '@mixins': resolve('src/mixins'),
      '@module': resolve('src/module'),
      '@plugins': resolve('src/plugins')
    }
  },
  module: {
    rules: [
      /*{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },*/
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}

// module.exports = webpackConfig
function fixedImport(source, fromStr){
    const parser = require('../src/libs/import-parser')
    return parser(source, function (opts) {
      let str = ''
      opts.components.forEach(function (component) {
        let file = `${fromStr}/${component.originalName}`
        str += `import ${component.newName} from '${file}'\n`
      })
      return str
    }, fromStr)
}
function doSomething (source) {
    if (/}\s+from(.*?)'@plugins\/ajax/.test(source)) {
      source = fixedImport(source, '@plugins/ajax');
    }
    if (/}\s+from(.*?)'@filters/.test(source)) {
      source = fixedImport(source, '@filters');
    }
    if (/}\s+from(.*?)'@plugins\/api/.test(source)) {
      source = fixedImport(source, '@plugins/api');
    }
    if (/}\s+from(.*?)'@components\/share/.test(source)) {
      source = fixedImport(source, '@components/share');
    }
    return source;
}

function makeRoute (route) {
  let _route = JSON.parse(JSON.stringify(route))
  let component = _route.component
  if(_route.children){
    _route.children.forEach((item, idx) => {
      _route.children[idx] = makeRoute(item)
    })
  }
  if(component){
    _route.component = `<fun>function (resolve) { require.ensure([], function () { resolve(require('${component}')) }, '${component.split('/').pop()}') }</fun>`
  }
  return _route
}

const vuxLoader = require('vux-loader')
module.exports = vuxLoader.merge(webpackConfig, {
  options: {},
  plugins: [
    {
      name: 'vux-ui'
    },
    {
      name: 'duplicate-style'
    },
    {
      name: 'inline-manifest'
    },
    {
      name: 'script-parser',
      fn: doSomething
    },
    {
      name: 'js-parser',
      fn: function (source) {
        if (source.indexOf('patientRoutes') != -1) {
          this.addDependency(routePath)
          let list = fs.readFileSync(routePath, 'utf-8')
          list = JSON.parse(list)

          let routes = []
          list.forEach(function(route) {
            routes.push(JSON.stringify(makeRoute(route)))
          }, this);
          routes = `[${routes.join(',\n')}]`
          routes = routes.replace(/"<fun>/g, '')
          routes = routes.replace(/<\/fun>"/g, '')
          source = source.replace('const patientRoutes = []', 'const patientRoutes = ' + routes)
        }
        return doSomething(source)
      }
    }
  ]
})
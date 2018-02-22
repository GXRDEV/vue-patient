var path = require('path')
var glob = require('glob')

var getEntry = function(globPath) {
  var entries = {},
    basename, tmp, pathname;

  glob.sync(globPath).forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-3);
    pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
    entries[pathname] = entry;
  });
  console.log("base-entrys:");
  console.log(entries);
  return entries;
}
var getComs = function(globPath){
  return {
    components: glob.sync(globPath)
  }
}
module.exports = {
    js: getEntry('./src/module/**/*.js'),
    vue: getComs('./src/components/**/*.vue'),
    html: getEntry('./src/module/**/*.html')
};

// module.exports = {
//     js: getEntry('./src/module/patient/patient.js'),
//     html: getEntry('./src/module/patient/patient.html')
// };
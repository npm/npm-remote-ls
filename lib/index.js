exports.RemoteLS = require('./remote-ls')

exports.config = function (opts) {
  return require('./config')(opts)
}

exports.ls = function (name, version, flatten, cb) {
  var ls = new exports.RemoteLS()

  if (typeof version === 'function') {
    cb = version
    version = 'latest'
  }

  if (typeof flatten === 'function') {
    cb = flatten
    flatten = false
  }

  ls.ls(name, version, function () {
    if (flatten) cb(Object.keys(ls.flat))
    else cb(ls.tree)
  })
}

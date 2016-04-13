var config = null

module.exports = function (opts) {
  if (!opts && config) {
    return config
  } else {
    config = opts
    return config
  }
}

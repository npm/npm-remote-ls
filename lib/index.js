exports.RemoteLS = require('./remote-ls');

exports.config = function(opts) {
  return require('./config')(opts);
};

// Includes production, development and optional dependencies.
exports.ls = function(name, version, flatten, cb) {
  var ls = new exports.RemoteLS();

  if (typeof version === 'function') {
    cb = version;
    version = 'latest';
  }

  if (typeof flatten === 'function') {
    cb = flatten;
    flatten = false;
  }

  ls.ls(name, version, function() {
    if (flatten) cb(Object.keys(ls.flat));
    else cb(ls.tree);
  });
};

// Includes production and optional dependencies.
exports.ls2 = function(name, version, flatten, cb) {
  var ls = new exports.RemoteLS();
  ls.development = false;

  if (typeof version === 'function') {
    cb = version;
    version = 'latest';
  }

  if (typeof flatten === 'function') {
    cb = flatten;
    flatten = false;
  }

  ls.ls(name, version, function() {
    if (flatten) cb(Object.keys(ls.flat));
    else cb(ls.tree);
  });
};

// Includes production and development dependencies.
exports.ls3 = function(name, version, flatten, cb) {
  var ls = new exports.RemoteLS();
  ls.optional = false;

  if (typeof version === 'function') {
    cb = version;
    version = 'latest';
  }

  if (typeof flatten === 'function') {
    cb = flatten;
    flatten = false;
  }

  ls.ls(name, version, function() {
    if (flatten) cb(Object.keys(ls.flat));
    else cb(ls.tree);
  });
};

// Includes production dependencies.
exports.ls4 = function(name, version, flatten, cb) {
  var ls = new exports.RemoteLS();
  ls.development = false;
  ls.optional = false;

  if (typeof version === 'function') {
    cb = version;
    version = 'latest';
  }

  if (typeof flatten === 'function') {
    cb = flatten;
    flatten = false;
  }

  ls.ls(name, version, function() {
    if (flatten) cb(Object.keys(ls.flat));
    else cb(ls.tree);
  });
};
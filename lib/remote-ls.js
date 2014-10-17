var _ = require('lodash'),
  async = require('async'),
  semver = require('semver'),
  request = require('request'),
  registryUrl = require('registry-url');


// perform a recursive walk of a remote
// npm package and determine its dependency
// tree.
function RemoteLS(opts) {
  var _this = this;

  _.extend(this, {
    logger: console,
    development: true, // include dev dependencies.
    optional: true, // include optional dependencies.
    verbose: false,
    registry: registryUrl,
    queue: async.queue(function (task, done) {
      _this._loadPackageJson(task, done);
    }, 8),
    tree: {},
    flat: {}
  }, require('./config')(), opts);

  this.queue.pause();
}

RemoteLS.prototype._loadPackageJson = function(task, done) {
  var _this = this;

  request.get(this.registry + task.name, {json: true}, function(err, res, obj) {
    if (err || (res.statusCode < 200 || res.statusCode >= 400)) {
      _this.logger.log(
        'could not load ' + task.name + '@' + task.version + ' status = ' + res.statusCode
      );
      return done();
    }

    try {
      if (_this.verbose) console.log('loading:', task.name + '@' + task.version);
      _this._walkDependencies(task, obj, done);
    } catch (e) {
      _this.logger.log(e.message);
      done();
    }
  });
};

RemoteLS.prototype._walkDependencies = function(task, packageJson, done) {
  var _this = this,
    version = this._guessVersion(task.version, packageJson),
    dependencies = _.extend(
      {},
      packageJson.versions[version].dependencies,
      this.optional ? packageJson.versions[version].optionalDependencies : {},
      // show development dependencies if we're at the root, and deevelopment flag is true.
      (task.parent === this.tree && this.development) ? packageJson.versions[version].devDependencies : {}
    ),
    fullName = packageJson.name + '@' + version,
    parent = task.parent[fullName] = {};

  if (_this.flat[fullName]) return done();
  else _this.flat[fullName] = true;

  Object.keys(dependencies).forEach(function(name) {
    _this.queue.push({
      name: name,
      version: dependencies[name],
      parent: parent
    });
  });

  done();
};

RemoteLS.prototype._guessVersion = function(versionString, packageJson) {
  if (versionString === 'latest') versionString = '*';

  var version = semver.maxSatisfying(Object.keys(packageJson.versions), versionString, true);

  if (!version) throw Error('could not find a satisfactory version for string ' + versionString);
  else return version;
};

RemoteLS.prototype.ls = function(name, version, callback) {
  var _this = this;

  this.queue.push({
    name: name,
    version: version,
    parent: this.tree
  });

  this.queue.drain = function() {
    callback(_this.tree);
  };

  this.queue.resume();
};

module.exports = RemoteLS;

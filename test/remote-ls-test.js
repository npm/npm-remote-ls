var test = require('tap').test
var nock = require('nock')
var fs = require('fs')
var RemoteLS = require('../lib/remote-ls')

test('RemoteLS', function (t) {
  t.test('guessVersion', function (t) {
    t.test('should handle an exact version being provided', function (t) {
      var versionString = '1.0.0'
      var packageJson = JSON.parse(
        fs.readFileSync('./test/fixtures/nopt.json').toString()
      )
      var ls = new RemoteLS()

      t.equal(
        ls._guessVersion(versionString, packageJson),
        '1.0.0'
      )
      t.end()
    })

    t.test('should handle a complex version being provided', function (t) {
      var versionString = '*'
      var packageJson = JSON.parse(
        fs.readFileSync('./test/fixtures/nopt.json').toString()
      )
      var ls = new RemoteLS()

      t.equal(
        ls._guessVersion(versionString, packageJson),
        '3.0.1'
      )
      t.end()
    })

    t.test('should raise an exception if version cannot be found', function (t) {
      var versionString = '9.0.0'
      var packageJson = JSON.parse(
        fs.readFileSync('./test/fixtures/nopt.json').toString()
      )
      var ls = new RemoteLS()

      t.throws(
        function () {
          ls._guessVersion(versionString, packageJson)
        },
        /could not find a satisfactory version/
      )
      t.end()
    })

    t.test('should raise an exception if version cannot be found', function (t) {
      var versionString = '9.0.0'
      var packageJson = JSON.parse(
        fs.readFileSync('./test/fixtures/nopt.json').toString()
      )
      var ls = new RemoteLS()

      t.throws(
        function () {
          ls._guessVersion(versionString, packageJson)
        },
        /could not find a satisfactory version/
      )
      t.end()
    })

    t.test('should handle "latest" being provided as version', function (t) {
      var versionString = 'latest'
      var packageJson = JSON.parse(
        fs.readFileSync('./test/fixtures/nopt.json').toString()
      )
      var ls = new RemoteLS()

      t.equal(
        ls._guessVersion(versionString, packageJson),
        '3.0.1'
      )
      t.end()
    })

    t.end()
  })

  t.test('_walkDependencies', function (t) {
    t.test('should push appropriate dependencies to queue', function (t) {
      var packageJson = JSON.parse(
        fs.readFileSync('./test/fixtures/nopt.json').toString()
      )
      var ls = new RemoteLS({
        queue: {
          pause: function () {},
          push: function (obj) {
            t.equal(obj.name, 'abbrev')
            t.equal(obj.version, '1')
            t.end()
          }
        }
      })

      ls._walkDependencies({
        name: 'nopt',
        version: '1.0.6',
        parent: {}
      }, packageJson, function () {})
    })

    t.test('should push devDependencies to queue', function (t) {
      var packageJson = JSON.parse(
        fs.readFileSync('./test/fixtures/nopt.json').toString()
      )
      var ls = new RemoteLS({
        queue: {
          pause: function () {},
          push: function (obj) {
            t.equal(obj.name, 'tap')
            t.equal(obj.version, '1.0.0')
            t.end()
          }
        }
      })

      ls._walkDependencies({
        name: 'nopt',
        version: '1.0.8',
        parent: ls.tree
      }, packageJson, function () {})
    })

    t.test('should not raise an exception if package has no dependencies', function (t) {
      var packageJson = JSON.parse(
        fs.readFileSync('./test/fixtures/abbrev.json').toString()
      )
      var ls = new RemoteLS()

      t.doesNotThrow(function () {
        ls._walkDependencies({
          name: 'abbrev',
          version: '*',
          parent: {}
        }, packageJson, function () {})
      })

      t.end()
    })

    t.test('should not walk dependency if dependency has already been observed', function (t) {
      var packageJson = JSON.parse(
        fs.readFileSync('./test/fixtures/nopt.json').toString()
      )
      var ls = new RemoteLS({
        flat: {
          'nopt@1.0.0': true
        },
        queue: {
          pause: function () {},
          push: function (obj) {
            t.fail('should not walk dependency')
            t.end()
          }
        }
      })

      ls._walkDependencies({
        name: 'nopt',
        version: '1.0.0',
        parent: {}
      }, packageJson, function () {})

      t.end()
    })

    t.end()
  })

  t.test('ls', function (t) {
    t.test('handles a 404 and prints an appropriate message', function (t) {
      nock('https://skimdb.npmjs.com')
          .get('/registry/request')
          .reply(404)
      var ls = new RemoteLS({
        registry: 'https://skimdb.npmjs.com/registry/',
        logger: {
          log: function (msg) {
            t.match(msg, /status = 404/)
            t.end()
          }
        }
      })

      ls.ls('request', '*', function () {})
    })

    t.end()
  })

  t.end()
})

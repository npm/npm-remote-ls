var Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  Code = require('code'),
  nock = require('nock'),
  fs = require('fs'),
  RemoteLS = require('../lib/remote-ls');

lab.experiment('RemoteLS', function() {

  lab.experiment('guessVersion', function() {
    lab.it('should handle an exact version being provided', function(done) {
      var versionString = '1.0.0',
        packageJson = JSON.parse(
          fs.readFileSync('./test/fixtures/nopt.json').toString()
        ),
        ls = new RemoteLS();

      Code.expect(
        ls._guessVersion(versionString, packageJson)
      ).to.equal('1.0.0');

      done();
    });

    lab.it('should handle a complex version being provided', function(done) {
      var versionString = '*',
        packageJson = JSON.parse(
          fs.readFileSync('./test/fixtures/nopt.json').toString()
        ),
        ls = new RemoteLS();

      Code.expect(
        ls._guessVersion(versionString, packageJson)
      ).to.equal('3.0.1');

      done();
    });

    lab.it('should raise an exception if version cannot be found', function(done) {
      var versionString = '9.0.0',
        packageJson = JSON.parse(
          fs.readFileSync('./test/fixtures/nopt.json').toString()
        ),
        ls = new RemoteLS();

      Code.expect(function() {
        ls._guessVersion(versionString, packageJson)
      }).to.throw(/could not find a satisfactory version/);

      done();
    });

    lab.it('should raise an exception if version cannot be found', function(done) {
      var versionString = '9.0.0',
        packageJson = JSON.parse(
          fs.readFileSync('./test/fixtures/nopt.json').toString()
        ),
        ls = new RemoteLS();

      Code.expect(function() {
        ls._guessVersion(versionString, packageJson)
      }).to.throw(/could not find a satisfactory version/);

      done();
    });

    lab.it('should handle "latest" being provided as version', function(done) {
      var versionString = 'latest',
        packageJson = JSON.parse(
          fs.readFileSync('./test/fixtures/nopt.json').toString()
        ),
        ls = new RemoteLS();

      Code.expect(
        ls._guessVersion(versionString, packageJson)
      ).to.equal('3.0.1');

      done();
    });
  });

  lab.experiment('_walkDependencies', function() {
    lab.it('should push appropriate dependencies to queue', function(done) {
      var packageJson = JSON.parse(
          fs.readFileSync('./test/fixtures/nopt.json').toString()
        ),
        ls = new RemoteLS({
          queue: {
            pause: function() {},
            push: function(obj) {
              Code.expect(obj.name).to.equal('abbrev');
              Code.expect(obj.version).to.equal('1');
              done();
            }
          }
        });

      ls._walkDependencies({
        name: 'nopt',
        version: '1.0.6',
        parent: {}
      }, packageJson, function() {});
    });

    lab.it('should push devDependencies to queue', function(done) {
      var packageJson = JSON.parse(
          fs.readFileSync('./test/fixtures/nopt.json').toString()
        ),
        ls = new RemoteLS({
          queue: {
            pause: function() {},
            push: function(obj) {
              Code.expect(obj.name).to.equal('tap');
              Code.expect(obj.version).to.equal('1.0.0');
              done();
            }
          }
        });

      ls._walkDependencies({
        name: 'nopt',
        version: '1.0.8',
        parent: ls.tree
      }, packageJson, function() {});
    });

    lab.it('should not raise an exception if package has no dependencies', function(done) {
      var packageJson = JSON.parse(
          fs.readFileSync('./test/fixtures/abbrev.json').toString()
        ),
        ls = new RemoteLS();

      ls._walkDependencies({
        name: 'abbrev',
        version: '*',
        parent: {}
      }, packageJson, function() {});

      done();
    });

    lab.it("should not walk dependency if dependency has already been observed", function(done) {
      var packageJson = JSON.parse(
          fs.readFileSync('./test/fixtures/nopt.json').toString()
        ),
        ls = new RemoteLS({
          flat: {
            'nopt@1.0.0': true
          },
          queue: {
            pause: function() {},
            push: function(obj) {
              Code.expect(obj.name).to.equal('tap');
              Code.expect(obj.version).to.equal('1.0.0');
              done();
            }
          }
        });

      ls._walkDependencies({
        name: 'nopt',
        version: '1.0.0',
        parent: {}
      }, packageJson, function() {});

      done();
    });
  });

  lab.experiment('ls', function() {
    lab.it('handles a 404 and prints an appropriate message', function(done) {
      var missingPackage = nock('https://skimdb.npmjs.com')
        .get('/registry/request')
        .reply(404),
        ls = new RemoteLS({
          registry: 'https://skimdb.npmjs.com/registry/',
          logger: {
            log: function(msg) {
              Code.expect(msg).to.match(/status = 404/);
              done();
            }
          }
        });

      ls.ls('request', '*', function() {});
    });

  });

});

var Lab = require('lab'),
  nock = require('nock'),
  fs = require('fs'),
  RemoteLS = require('../lib/remote-ls');

Lab.experiment('RemoteLS', function() {

  Lab.experiment('guessVersion', function() {
    Lab.it('should handle an exact version being provided', function(done) {
      var versionString = '1.0.0',
        packageJson = JSON.parse(
          fs.readFileSync('./test/fixtures/nopt.json').toString()
        ),
        ls = new RemoteLS();

      Lab.expect(
        ls._guessVersion(versionString, packageJson)
      ).to.eql('1.0.0');

      done();
    });

    Lab.it('should handle a complex version being provided', function(done) {
      var versionString = '*',
        packageJson = JSON.parse(
          fs.readFileSync('./test/fixtures/nopt.json').toString()
        ),
        ls = new RemoteLS();

      Lab.expect(
        ls._guessVersion(versionString, packageJson)
      ).to.eql('3.0.1');

      done();
    });

    Lab.it('should raise an exception if version cannot be found', function(done) {
      var versionString = '9.0.0',
        packageJson = JSON.parse(
          fs.readFileSync('./test/fixtures/nopt.json').toString()
        ),
        ls = new RemoteLS();

      Lab.expect(function() {
        ls._guessVersion(versionString, packageJson)
      }).to.throw(/could not find a satisfactory version/);

      done();
    });

    Lab.it('should raise an exception if version cannot be found', function(done) {
      var versionString = '9.0.0',
        packageJson = JSON.parse(
          fs.readFileSync('./test/fixtures/nopt.json').toString()
        ),
        ls = new RemoteLS();

      Lab.expect(function() {
        ls._guessVersion(versionString, packageJson)
      }).to.throw(/could not find a satisfactory version/);

      done();
    });

    Lab.it('should handle "latest" being provided as version', function(done) {
      var versionString = 'latest',
        packageJson = JSON.parse(
          fs.readFileSync('./test/fixtures/nopt.json').toString()
        ),
        ls = new RemoteLS();

      Lab.expect(
        ls._guessVersion(versionString, packageJson)
      ).to.eql('3.0.1');

      done();
    });
  });

  Lab.experiment('_walkDependencies', function() {
    Lab.it('should push appropriate dependencies to queue', function(done) {
      var packageJson = JSON.parse(
          fs.readFileSync('./test/fixtures/nopt.json').toString()
        ),
        ls = new RemoteLS({
          queue: {
            pause: function() {},
            push: function(obj) {
              Lab.expect(obj.name).to.eql('abbrev');
              Lab.expect(obj.version).to.eql('1');
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

    Lab.it('should push devDependencies to queue', function(done) {
      var packageJson = JSON.parse(
          fs.readFileSync('./test/fixtures/nopt.json').toString()
        ),
        ls = new RemoteLS({
          queue: {
            pause: function() {},
            push: function(obj) {
              Lab.expect(obj.name).to.eql('tap');
              Lab.expect(obj.version).to.eql('1.0.0');
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

    Lab.it('should not raise an exception if package has no dependencies', function(done) {
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

    Lab.it("should not walk dependency if dependency has already been observed", function(done) {
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
              Lab.expect(obj.name).to.eql('tap');
              Lab.expect(obj.version).to.eql('1.0.0');
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

  Lab.experiment('ls', function() {
    Lab.it('handles a 404 and prints an appropriate message', function(done) {
      var missingPackage = nock('https://skimdb.npmjs.com')
        .get('/registry/request')
        .reply(404),
        ls = new RemoteLS({
          logger: {
            log: function(msg) {
              Lab.expect(msg).to.match(/status = 404/);
              done();
            }
          }
        });

      ls.ls('request', '*', function() {});
    });

  });

});

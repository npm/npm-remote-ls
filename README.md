# npm-remote-ls

[![Build Status](https://travis-ci.org/npm/npm-remote-ls.png)](https://travis-ci.org/npm/npm-remote-ls)
[![Coverage Status](https://coveralls.io/repos/npm/npm-remote-ls/badge.svg?branch=)](https://coveralls.io/r/npm/npm-remote-ls?branch=master)
[![NPM version](https://img.shields.io/npm/v/npm-remote-ls.svg)](https://www.npmjs.com/package/npm-remote-ls)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

Examine a package's dependency graph before you install it.

## Installation

```bash
npm install npm-remote-ls -g
```

## Usage

### Listing Package Dependencies

```
npm-remote-ls sha@1.2.4

└─ sha@1.2.4
   ├─ readable-stream@1.0.27-1
   │  ├─ isarray@0.0.1
   │  ├─ string_decoder@0.10.25
   │  ├─ inherits@2.0.1
   │  └─ core-util-is@1.0.1
   └─ graceful-fs@3.0.2
```

### Help!

There are various command line flags you can toggle for `npm-remote-ls`, for
details run:

```bash
npm-remote-ls --help
```

## API

**Return dependency graph for `latest` version:**

```javascript
var ls = require('npm-remote-ls').ls;

ls('grunt', 'latest', function(obj) {
  console.log(obj);
});
```

**Return dependency graph for specific version:**

```javascript
var ls = require('npm-remote-ls').ls;

ls('grunt', '0.1.0', function(obj) {
  console.log(obj);
});
```

**Return a flattened list of dependencies:**

```javascript
var ls = require('npm-remote-ls').ls;

ls('grunt', '0.1.0', true, function(obj) {
  console.log(obj);
});
```

**Configure to only return production dependencies:**

```javascript
var ls = require('npm-remote-ls').ls
var config = require('npm-remote-ls').config

config({
  development: false,
  optional: false
})

ls('yargs', 'latest', true, function (obj) {
  console.log(obj)
})
```

**Configure to return peer dependencies:**

```javascript
var ls = require('npm-remote-ls').ls
var config = require('npm-remote-ls').config

config({
  development: true,
  peer: true
})

ls('grunt-contrib-coffee', 'latest', true, function (obj) {
  console.log(obj)
})
```

## License

ISC

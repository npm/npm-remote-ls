# npm-remote-ls

[![Build Status](https://travis-ci.org/npm/npm-remote-ls.png)](https://travis-ci.org/npm/npm-remote-ls)

Examine a package's dependency graph before you install it.

# Installation

```bash
npm install npm-remote-ls -g
```

# Usage

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

# API

** Get dependency tree for latest version:**

```javascript
var ls = require('npm-remote-ls').ls;

ls('grunt', 'latest', function(obj) {
  console.log(obj);
});
```

** Get dependency tree for specific version:**

```javascript
var ls = require('npm-remote-ls').ls;

ls('grunt', '0.1.0', function(obj) {
  console.log(obj);
});
```

**Flatten the list of dependencies:**

```javascript
var ls = require('npm-remote-ls').ls;

ls('grunt', '0.1.0', true, function(obj) {
  console.log(obj);
});
```

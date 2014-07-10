#!/usr/bin/env node

var yargs = require('yargs')
  .options('n', {
    alias: 'name',
    description: 'package name'
  })
  .options('v', {
    alias: 'version',
    description: 'package version',
    default: 'latest'
  })
  .options('e', {
    alias: 'verbose',
    description: 'enable verbose logging',
    default: false,
    boolean: true
  })
  .options('d', {
    alias: 'development',
    description: 'show development dependencies',
    default: true,
    boolean: true
  })
  .options('o', {
    alias: 'optional',
    description: 'show optional dependencies',
    default: true,
    boolean: true
  })
  .options('f', {
    alias: 'flatten',
    description: 'return flat representation of dependencies',
    default: false,
    boolean: true
  }),
  ls = require('../lib').ls,
  treeify = require('treeify'),
  spinner = require("char-spinner");

require('../lib').config({
  verbose: yargs.argv.verbose,
  development: yargs.argv.development,
  optional: yargs.argv.optional
});

var name = yargs.argv.name || yargs.argv._[0] || '',
  version = name.split('@')[1] || yargs.argv.version;

if (yargs.argv.help || !name) {
  console.log(yargs.help());
} else {
  spinner();
  ls(name.split('@')[0], version, yargs.argv.flatten, function(obj) {
    if (Array.isArray(obj)) console.log(obj);
    else console.log(treeify.asTree(obj));
  });
}

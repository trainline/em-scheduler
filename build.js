'use strict';

let archiver = require('archiver-promise');
let fs = require('fs-extra');
let globby = require('globby');

let config = require('./package.json');

let outDir = 'out';
let buildDir = `${outDir}/build`;

async function build() {
  await fs.ensureDir(outDir);
  await clean(buildDir);
  await copyFiles(config.files, buildDir);
};

async function copyFiles(globs, dest) {
  let files = await globby(globs);
  return Promise.all(files.map(file =>
    fs.copy(file, `${dest}/${file}`)))
}

function clean(dir) {
  return fs.remove(dir)
    .then(() => fs.mkdir(dir))
}

build()
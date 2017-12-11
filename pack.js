'use strict';

let archiver = require('archiver-promise');
let fs = require('fs-extra');

let config = require('./package.json');

async function pack() {
  let outDir = 'out';
  let buildDir = `${outDir}/build`;
  let packageDir = `${outDir}/package`;
  let zipFile = `${packageDir}/${config.name}.zip`;

  await fs.ensureDir(outDir);
  await clean(packageDir);
  await zipDir(buildDir, zipFile);

  console.log(zipFile)
}

function clean(dir) {
  return fs.remove(dir)
    .then(() => fs.mkdir(dir))
}

function zipDir(dir, zip) {
  let archive = archiver(zip);
  archive.pipe(fs.createWriteStream(zip));
  archive.directory(dir, '/');
  return archive.finalize();
}

pack();
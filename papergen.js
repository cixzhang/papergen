#!/usr/bin/env node
// Papergen

const path = require('path');
const cli = require('./lib/cli');
const build = require('./lib/build');

const Booklet = require('./lib/booklet');

const { spawn } = require('child_process');

function papergen(pages, options) {
  build(pages, options);

  const electron = path.resolve(__dirname, 'node_modules', '.bin', 'electron');
  const main = path.resolve(__dirname, 'lib', 'main.js');
  const child = spawn(electron, [main]);

  child.stdout.on('data', (data) => {
    console.log('Electron: ', data.toString());
  });
  child.stderr.on('data', (data) => {
    console.error('Electron: ', data.toString());
  });
  child.on('close', (code) => {
    console.log(`Electron process closed with ${code}`);
  });
}

papergen.Page = require('./lib/page');
papergen.fromBooklet = (booklet) => {
  if (booklet instanceof Booklet) {
    papergen(booklet.pages, booklet.options);
    return;
  }
  console.error('Not a booklet.');
};

if (require.main === module) {
  const cliResult = cli(process.argv);
  if (cliResult) {
    return papergen(cliResult.pages, cliResult.options);
  }
}

module.exports = papergen;

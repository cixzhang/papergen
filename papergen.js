#!/usr/bin/env node
// Papergen

const path = require('path');
const cli = require('./lib/cli');
const build = require('./lib/build');

const { spawn } = require('child_process');

function papergen(pageConfigs, rendererOptions) {
  build(pageConfigs, rendererOptions);

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

if (require.main === module) {
  const cliResult = cli(process.argv);
  if (cliResult) {
    console.log(cliResult);
    return papergen(cliResult.pageConfigs, cliResult.rendererOptions);
  }
}

module.exports = papergen;

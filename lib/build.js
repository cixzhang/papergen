/**
 * build.js
 *
 * Given the pageConfigs, builds a series of js files
 * for use in rendering in Electron
 *
 * - bundle.js: configuration options and dependencies to inject into the page.
 * - render.js: render method and dependencies called as an iife
 */

const fs = require('fs');
const path = require('path');
const getPageModule = require('./getPageModule');

function build(pageConfigs) {
  buildBundle(pageConfigs);
}

function buildBundle(pageConfigs) {
  let bundleString = ``;
  let exportString = `module.exports = {`;
  let uniqueId = 0;

  pageConfigs.forEach(config => {
    bundleString = `${bundleString}const ${config.page.name} = require('${config.pagePath}');`;
    exportString = `${exportString}${config.page.name},`;
  });
  exportString = `${exportString}};`;

  const bundleRawPath = path.resolve(__dirname, '../build', 'bundle.raw.js');
  const bundleRaw = fs.writeFileSync(bundleRawPath, `${bundleString} ${exportString}`);
}

module.exports = build;


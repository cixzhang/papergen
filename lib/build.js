/**
 * build.js
 *
 * Given the pageConfigs, builds a series of js files
 * for use in rendering in Electron
 *
 * - bundle.js: dependencies to inject into the page.
 * - config.js: configuration array
 */

const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const getPageModule = require('./getPageModule');

const {
  depsModuleName,
  configModuleName,
  rawDepsPath,
  rawConfigPath,
  bundlePath,
  configPath
} = require('./config');

function build(pageConfigs, rendererOptions) {
  const dedupedConfigs = getDedupedPageConfigs(pageConfigs);
  buildRawDeps(dedupedConfigs, rawDepsPath);
  buildRawConfig(dedupedConfigs, rendererOptions, rawConfigPath);
  buildBundle(rawDepsPath, rawConfigPath, bundlePath, configPath);
  return bundlePath;
}

function getDedupedPageConfigs(pageConfigs) {
  const encounteredPages = new Map();
  const uniqueId = 0;

  return pageConfigs.map(config => {
    const adjustedConfig = {...config};
    const name = config.page.name;
    const pagePath = config.pagePath;

    if (encounteredPages.has(name)) {
      const expectedPath = encounteredPages.get(name);
      // This is a new module with the same name
      // We'll adjust the name.
      if (expectedPath !== pagePath) {
        adjustedConfig.page.name = `${config.page.name}_${uniqueId++}`;
      } else {
        adjustedConfig.loaded = true;
      }
    } else {
      encounteredPages.set(name, pagePath);
    }
    return adjustedConfig;
  });
}

function buildRawDeps(pageConfigs, rawDepsPath) {
  let bundleString = ``;
  let exportString = `module.exports = {`;

  pageConfigs.forEach(config => {
    if (config.loaded) {
      return;
    }
    bundleString = `${bundleString}const ${config.page.name} = require('${config.pagePath}');`;
    exportString = `${exportString}${config.page.name},`;
  });
  exportString = `${exportString}};`;

  fs.writeFileSync(rawDepsPath, `${bundleString} ${exportString}`);
}

function buildRawConfig(pageConfigs, rendererOptions, rawConfigPath) {
  const configArray = pageConfigs.map((config) => {
    return {
      name: config.page.name,
      options: config.options,
    };
  });
  const config = {
    rendererOptions,
    pageConfigs: configArray,
  };
  const exportString = `module.exports = ${JSON.stringify(config)};`;
  fs.writeFileSync(rawConfigPath, exportString);
}

function buildBundle(rawDepsPath, rawConfigPath, bundlePath, configPath) {
  const deps = browserify(rawDepsPath, {standalone: depsModuleName});
  const depsWritable = fs.createWriteStream(bundlePath);
  deps.bundle().pipe(depsWritable);

  const config = browserify(rawConfigPath, {standalone: configModuleName});
  const configWritable = fs.createWriteStream(configPath);
  config.bundle().pipe(configWritable);
}

module.exports = build;

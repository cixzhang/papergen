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
const browserify = require('browserify');

const {
  depsModuleName,
  configModuleName,
  rawDepsPath,
  rawConfigPath,
  bundlePath,
  configPath
} = require('./config');

function build(pages, options) {
  const dedupedPages = getDedupedPages(pages);
  buildRawDeps(dedupedPages, rawDepsPath);
  buildRawConfig(dedupedPages, options, rawConfigPath);
  buildBundle(rawDepsPath, rawConfigPath, bundlePath, configPath);
  return bundlePath;
}

function getDedupedPages(pages) {
  const encounteredPages = new Map();
  const uniqueId = 0;

  return pages.map(page => {
    const adjusted = {...page};
    const name = page.module.name;
    const pagePath = page.module.filename;

    if (encounteredPages.has(name)) {
      const expectedPath = encounteredPages.get(name);
      // This is a new module with the same name
      // We'll adjust the name.
      if (expectedPath !== pagePath) {
        adjusted.module.name = `${name}_${uniqueId++}`;
      } else {
        adjusted.loaded = true;
      }
    } else {
      encounteredPages.set(name, pagePath);
    }
    return adjusted;
  });
}

function buildRawDeps(pages, rawDepsPath) {
  let bundleString = ``;
  let exportString = `module.exports = {`;

  pages.forEach(page => {
    if (page.loaded) {
      return;
    }
    bundleString = `${bundleString}const ${page.module.name} = require('${page.module.filename}');`;
    exportString = `${exportString}${page.module.name},`;
  });
  exportString = `${exportString}};`;

  fs.writeFileSync(rawDepsPath, `${bundleString} ${exportString}`);
}

function buildRawConfig(pages, options, rawConfigPath) {
  const config = {
    options,
    pages: pages.map((page) => {
      return {
        name: page.module.name,
        options: page.options,
      };
    }),
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

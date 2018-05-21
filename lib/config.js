const path = require('path');

module.exports = {
  rawDepsPath: path.resolve(__dirname, './build', 'bundle.raw.js'),
  rawConfigPath: path.resolve(__dirname, './build', 'config.raw.js'),

  bundlePath: path.resolve(__dirname, './build', 'bundle.js'),
  configPath: path.resolve(__dirname, './build', 'config.js'),
};


const path = require('path');
const Page = require('./page');

function getPageModule(relpath) {
  const cwd = process.cwd();
  const modpath = path.resolve(cwd, relpath);

  const mod = require(modpath);
  if (!(mod instanceof Page)) {
    throw Error('Module is not a Page.');
  }
  return mod;
}

module.exports = getPageModule;


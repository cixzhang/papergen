
const path = require('path');
const optionator = require('optionator');
const Page = require('./page');

const parser = optionator({
  prepend: 'Usage: papergen [page module]',
  options: []
});

function getModule(relpath) {
  const cwd = process.cwd();
  const modpath = path.resolve(cwd, relpath);

  const mod = require(modpath);
  if (!(mod instanceof Page)) {
    throw Error('Module is not a Page.');
  }
  return mod;
}

function cli(argv) {
  let generator;
  let invalid = false;

  try {
    generator = getModule(argv[2]);
  } catch (e) {
    console.error(e);
    invalid = true;
  }

  if (invalid) {
    console.log(parser.generateHelp());
    return;
  }

  generator.cli(argv);
}

module.exports = cli;


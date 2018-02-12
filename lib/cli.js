
const path = require('path');
const optionator = require('optionator');
const Page = require('./page');
const Renderer = require('./renderer');

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

  const options = generator._getCLIOptions(argv);
  if (!options) return;

  const output = render(generator, options);
  console.log(output);
}

function render(generator, options) {
  const renderer = new Renderer();
  generator._render(renderer, options);
  return renderer.toHTML();
}

module.exports = cli;


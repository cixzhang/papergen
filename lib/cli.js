
const path = require('path');
const optionator = require('optionator');
const Page = require('./page');
const Renderer = require('./renderer');


const optionatorObj = {
  prepend: 'Usage: papergen [page module]',
  options: [],
};

function getModule(relpath) {
  const cwd = process.cwd();
  const modpath = path.resolve(cwd, relpath);

  const mod = require(modpath);
  if (!(mod instanceof Page)) {
    throw Error('Module is not a Page.');
  }
  return mod;
}

function getModuleParser(mod) {
  const extraOpts = [
    {
      option: 'html',
      type: 'Boolean',
      default: false,
      description: 'Output HTML (debugging)',
    },
    {
      option: 'help',
      alias: 'h',
      type: 'Boolean',
      description: 'Displays help.',
    },
  ];

  const modOptions = mod._options();

  const prepend = `Page module: ${mod.name}`;
  const append = mod.description;

  const parser = optionator({
    prepend,
    append,
    options: [...modOptions, ...extraOpts],
  });
  return parser;
}

function cli(argv) {
  let mod;
  let invalid = false;

  try {
    mod = getModule(argv[2]);
  } catch (e) {
    console.error(e);
    invalid = true;
  }

  if (invalid) {
    const parser = optionator({
      prepend: 'Usage: papergen [page module]',
      options: [],
    });
    console.log(parser.generateHelp());
    return;
  }

  const parser = getModuleParser(mod);
  const options = parser.parseArgv(argv);
  if (!options) return;

  if (options.help) {
    console.log(parser.generateHelp());
  } else {
    render(mod, options)
      .catch(e => console.error(e))
      .then(buf => process.stdout.write(buf));
  }
}

function render(mod, options) {
  const renderer = new Renderer();
  mod._render(renderer, options);

  if (options.html) return renderer.toHTML();
  return renderer.toPDF();
}

module.exports = cli;


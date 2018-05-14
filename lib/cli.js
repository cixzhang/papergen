
const path = require('path');
const { spawn } = require('child_process');
const optionator = require('optionator');
const Page = require('./page');
const Renderer = require('./renderer');
const render = require('./render');

function getModule(relpath) {
  const cwd = process.cwd();
  const modpath = path.resolve(cwd, relpath);

  const mod = require(modpath);
  if (!(mod instanceof Page)) {
    throw Error('Module is not a Page.');
  }
  return mod;
}

function getModuleOptions(mod) {
  const typeMap = {
    number: 'Number',
    string: 'String',
    boolean: 'Boolean',
    seed: 'String',
  };
  const options = mod.inputs.map((input) => ({
    option: input.key,
    type: typeMap[input.type],
    longDescription: input.description,
    default: input.default,
  }));

  return options;
}

function getModuleParser(mod) {
  const extraOpts = [
    ...Renderer.options,
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

  const modOptions = getModuleOptions(mod);
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
    // render(mod, options)
    //   .catch(e => console.error(e))
    //   .then(buf => process.stdout.write(buf));
    const electron = path.resolve(__dirname, '../node_modules/.bin', 'electron');
    console.log(electron, `${__dirname}/main.js`);
    const child = spawn(electron, [`${__dirname}/main.js`]);

    child.stdout.on('data', (data) => { console.log('Electron: ', data); });
    child.stderr.on('data', (data) => { console.error('Electron: ', data); });
    child.on('close', (code) => { console.log(`Electron process closed with ${code}`); });
  }
}

module.exports = cli;


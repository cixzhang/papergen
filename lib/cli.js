
const optionator = require('optionator');
const Page = require('./page');
const Renderer = require('./renderer');

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
  let modpath;
  let invalid = false;

  try {
    modpath = argv[2];
    mod = getModule(modpath);
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
    return {
      pageConfigs: [
        {
          page: mod,
          pagePath: modpath,
          options,
        },
      ]
    };
  }
}

module.exports = cli;


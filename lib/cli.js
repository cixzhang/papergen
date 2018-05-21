
const path = require('path');
const optionator = require('optionator');
const Page = require('./page');
const Renderer = require('./renderer');
const getModule = require('./getPageModule');

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

  const rendererOptions = {};
  Renderer.options.forEach(opt => {
    if (opt.option in options) {
      rendererOptions[opt.option] = options[opt.option];
    }
  });

  if (options.help) {
    console.log(parser.generateHelp());
  } else {
    return {
      pageConfigs: [
        {
          page: mod,
          pagePath: path.resolve(process.cwd(), modpath),
          options,
        },
      ],
      rendererOptions,
    };
  }
}

module.exports = cli;

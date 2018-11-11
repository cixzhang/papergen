
const path = require('path');
const optionator = require('optionator');

const Booklet = require('./booklet');
const Page = require('./page');
const Renderer = require('./renderer');

const baseOptions = [
  {
    option: 'output',
    alias: 'o',
    type: 'String',
    description: 'Output PDF file name.',
    required: true,
  },
  {
    option: 'help',
    alias: 'h',
    type: 'Boolean',
    description: 'Displays help.',
    overrideRequired: true,
  },
  {
    option: 'debug',
    type: 'Boolean',
    default: false,
    description: 'Debug mode. Keeps the electron renderer open.',
    hidden: true,
  },
];

function getModule(relpath) {
  const cwd = process.cwd();
  const modpath = path.resolve(cwd, relpath);
  const mod = require(modpath);
  return mod;
}

function getModuleType(mod) {
  if (mod instanceof Page) {
    return 'page';
  }

  if (mod instanceof Booklet) {
    return 'booklet';
  }

  throw Error('Module is neither a page nor a booklet');
}

function getModuleParserForBooklet(mod) {
  const prepend = `
  ------------------
  Generate a Booklet
  ------------------`;

  const parser = optionator({
    prepend,
    options: [...baseOptions],
  });
  return parser;
}

function getModuleParserForPage(mod) {
  const typeMap = {
    number: 'Number',
    string: 'String',
    boolean: 'Boolean',
    seed: 'String',
  };
  const modOptions = mod.inputs.map((input) => ({
    option: input.key,
    type: typeMap[input.type],
    longDescription: input.description,
    default: input.default,
  }));

  const prepend = `
  ---------------------------
  ${mod.name}: ${mod.description}
  ---------------------------`;
  const parser = optionator({
    prepend,
    options: [...modOptions, ...Renderer.options, ...baseOptions],
  });
  return parser;
}

function getArgsForPage(mod, modPath, options, rendererOptions) {
  return {
    pageConfigs: [
      {
        page: mod,
        pagePath: path.resolve(process.cwd(), modPath),
        options,
      },
    ],
    rendererOptions,
  };
}

function getArgsForBooklet(booklet, bookletPath, _, rendererOptions) {
  const bookletDir = path.resolve(process.cwd(), bookletPath, '..');
  const pageConfigs = booklet.pages.map(
    ({module, options}) => ({
      page: require(module),
      pagePath: path.resolve(bookletDir, module),
      options,
    })
  );
  return {
    pageConfigs,
    rendererOptions: {...rendererOptions, ...booklet.options},
  };
}

function cli(argv) {
  let mod;
  let modpath;
  let modType;
  let invalid = false;

  const modParserMap = {
    page: getModuleParserForPage,
    booklet: getModuleParserForBooklet,
  };

  const modArgsMap = {
    page: getArgsForPage,
    booklet: getArgsForBooklet,
  };

  try {
    modpath = argv[2];
    mod = getModule(modpath);
    modType = getModuleType(mod);
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

  const parser = modParserMap[modType](mod);
  const options = parser.parseArgv(argv);
  // TODO: retrieve options for booklet renderer separately from page (or not?)
  // TODO: generate page configs for booklet separately from page
  if (!options) return;

  const rendererOptions = {};
  Renderer.options.forEach(opt => {
    if (opt.option in options) {
      rendererOptions[opt.option] = options[opt.option];
    }
  });

  // Append output and debug options
  rendererOptions.output = options.output;
  rendererOptions.debug = options.debug;

  if (options.help) {
    console.log(parser.generateHelp());
  } else {
    return modArgsMap[modType](mod, modpath, options, rendererOptions);
  }
}

module.exports = cli;

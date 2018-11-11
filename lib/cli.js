
const path = require('path');
const optionator = require('optionator');

const Booklet = require('./booklet');
const Page = require('./page');
const Renderer = require('./renderer');

const baseOptions = [
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
  const parser = optionator({
    prepend,
    append,
    options: baseOptions,
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

  const prepend = `Page module: ${mod.name}`;
  const append = mod.description;

  const parser = optionator({
    prepend,
    append,
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

function getArgsForBooklet(booklet, bookletPath, options, rendererOptions) {
  const fullBookletPath = path.resolve(process.cwd(), bookletPath);
  const pageConfigs = booklet.pages.map(
    ({pagePath, pageOptions}) => ({
      page: require(pagePath),
      pagePath: path.resolve(fullBookletPath, pagePath),
      options: pageOptions,
    })
  );

  return {
    pageConfigs,
    rendererOptions: booklet.options,
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

  if (options.help) {
    console.log(parser.generateHelp());
  } else {
    return modArgsMap[modType](mod, modpath, options, rendererOptions);
  }
}

module.exports = cli;

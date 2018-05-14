
const fs = require('fs');

function generateFile(mod, options, filename) {
  const insert = `
    const render = require('./render');
    const mod = require('${module}');
    const options = ${options.toJSON()};

    render(mod, options);
  `;

  fs.writeFileSync(filename, insert);
  return filename;
};



const Renderer = require('./renderer');

function render(mod, options) {
  const renderer = new Renderer(options);
  mod._render(renderer);

  let output;

  if (options.html) output = renderer.toHTML();
  else output = renderer.toPDF();

  renderer.teardown();
  return output;
}

module.exports = render;


/*
 * Page
 * ----
 *
 * Pages contain the following attributes:
 *
 *   * name
 *   * description
 *   * inputs
 *   * render
 *
 * When constructing a Page, we will validate the
 * initial object passed through.
 *
 * Pages must contain a name and a render method.
 * If the page includes inputs, we will also validate
 * each input.
 *
 */

const v = require('./validators');

class Page {
  constructor(page) {
    this.validate(page);
    this.name = page.name;
    this.filename = page.filename;
    this.description = page.description || '';
    this.render = page.render.bind(page);

    this.inputs = page.inputs || [];
    this.defaults = {};
    this.validators = {};

    this.setupInputs();
  }

  setupInputs() {
    const defaults = this.defaults;
    const validators = this.validators;
    this.inputs.forEach(input => {
      if (input.initial != null) defaults[input.key] = input.initial;
      if (input.type === 'number') {
        validators[input.key] =
          v.createNumberBetween(input.min, input.max);
      } else {
        validators[input.key] = v[input.type];
      }
    });
  }

  validate(page) {
    const pageAttrs = {
      name: {
        validate: v.string,
        invalidText: 'name must be a string',
      },
      filename: {
        validate: v.string,
        invalidText: 'filename must be __filename',
      },
      render: {
        validate: v.function,
        invalidText: 'render must be a function',
      },
    };

    if (!('name' in page)) throw Error(`Page needs a name.`);
    if (!('render' in page)) {
      throw Error(`Page ${page.name} needs a render method.`);
    }

    Object.keys(pageAttrs).forEach(
      (key) => {
        const valid = pageAttrs[key].validate(page[key]);
        if (!valid) {
          throw Error(`Page's ${pageAttrs[key].invalidText}`);
        }
      }
    );
  }

  validateOptions(options) {
    Object.keys(options).forEach(key => {
      if (!(key in this.validators)) {
        return;
      }
      if (!this.validators[key](options[key])) {
        throw Error(`${key} is invalid.`);
      }
    });
    return Object.assign({}, this.defaults, options);
  }
}

module.exports = Page;


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

const optionator = require('optionator');
const v = require('./validators');

class Page {
  constructor(page) {
    this.validate(page);
    this.name = page.name;
    this.description = page.description || '';
    this.inputs = page.inputs || [];
    this.render = page.render.bind(page);
  }


  validate(page) {
    const pageAttrs = {
      name: {
        validate: v.string,
        invalidText: 'name must be a string',
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
    // TODO: validate options
  }
}

module.exports = Page;


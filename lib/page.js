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
    this.description = page.description || '';
    this.inputs = page.inputs || [];
    this.render = page.render;
  }

  validate(page) {
    const validators = {
      name: v.string,
      render: v.function,
    };

    if (!('name' in page)) throw Error(`Page needs a name.`);
    if (!('render' in page)) {
      throw Error(`Page ${page.name} needs a render method.`);
    }

    Object.keys(validators).forEach(
      (key) => {
        const invalid = validatorsMap[key](page[key]);
        if (invalid) {
          throw Error(`Page's ${key}: ${invalid}.`);
        }
      }
    );
  }
}

module.exports = Page;


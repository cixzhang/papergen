
const Page = require('./page');

class Booklet {
  constructor(booklet) {
    this.validate(booklet);
    this.options = booklet.options;
    this.pages = booklet.pages;
  }

  validate(booklet) {
    if (!('pages' in booklet)) throw Error(`Booklet needs pages.`);
    if (!Array.isArray(booklet.pages)) {
      throw Error(`Booklet pages must be a list`);
    }

    const pageAttrs = {
      module: {
        validate: (module) => (
          typeof module === 'string' &&
          require(module) instanceof Page
        ),
        invalidText: 'module path must resolve to a Page',
      },
      options: {
        validate: (options, module) => module.validateOptions(options),
        invalidText: 'options were invalid, see error above.',
      },
    };

    booklet.pages.forEach((page) => {
      Object.keys(pageAttrs).forEach(
        (key) => {
          const valid = pageAttrs[key].validate(page[key], page.module);
          if (!valid) {
            throw Error(`Page ${pageAttrs[key].invalidText}`);
          }
        }
      );
    });
  }
}

module.exports = Booklet;

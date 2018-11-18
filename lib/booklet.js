
const Page = require('./page');

class Booklet {
  constructor(booklet) {
    this.validate(booklet);
    this.options = booklet.options;
    this.pages = booklet.pages;
  }

  validate(booklet) {
    if (!('pages' in booklet)) throw Error(`Booklet needs a list of pages.`);
    if (!Array.isArray(booklet.pages)) {
      throw Error(`Booklet's pages must be a list of pages.`);
    }

    const pageAttrs = {
      module: {
        validate: (module) => module instanceof Page,
        invalidText: 'module must be a Page',
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

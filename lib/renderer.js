
const PageSizes = require('./pageSizes');

class Renderer {
  constructor(options) {
    this.pages = [];

    this.pageSize = PageSizes.getSizeWithOrientation(
      options.pageSize,
      options.landscape,
    );
    this.pageSizePx = PageSizes.toPixelsFromMM(this.pageSize);
    this.options = options;
  }

  clear() {
    const style = document.createElement('style');
    style.type = 'text/css';
    document.body.innerHTML = '';
    document.body.appendChild(style);
    this.setupCSS();
    this.pages = [];
  }

  setupCSS(style) {
    const dpx = this.pageSizePx;
    const stylesheet = document.styleSheets[0];
    const rules = [`
      * { box-sizing: border-box; }
    `,`
      html, body {
        margin: 0;
        padding: 0;
      }
    `,`
      .page {
        width: ${dpx[0]}px;
        height: ${dpx[1]}px;
        box-sizing: border-box;
      }
    `];
    rules.forEach(rule => stylesheet.insertRule(rule));
  }

  createPage() {
    const body = document.body;
    const newPage = document.createElement('div');
    newPage.classList.add('page');

    body.appendChild(newPage);
    this.pages.push(newPage);

    return newPage;
  }

  renderPage(page, options) {
    const pageEl = this.createPage();
    const pageOptions = page.validateOptions(options);
    page.render(pageEl, pageOptions, this.options);
  }

  // pages should be in the form provided by booklet.js
  // * module
  // * options
  renderPages(pages) {
    pages.forEach(({module, options}) => {
      this.renderPage(module, Object.assign({}, options, this.options));
    });
  }
}

Renderer.options = [
  {
    option: 'pageSize',
    type: 'String',
    default: 'Letter',
    description: 'Page size. Can be one of Letter, Legal, Tabloid, A0 through A9, B0 through B9.'
  },
  {
    option: 'landscape',
    type: 'Boolean',
    default: false,
    description: 'Landscape mode. Overrides portrait mode.'
  },
  {
    option: 'portrait',
    type: 'Boolean',
    default: false,
    description: 'Portrait mode.'
  },
  {
    option: 'ppi',
    type: 'Int',
    default: String(PageSizes.PPI),
    description: 'Pixels per inch.'
  },
  {
    option: 'output',
    alias: 'o',
    type: 'String',
    description: 'Output PDF file name.',
    required: true,
  },
  {
    option: 'debug',
    type: 'Boolean',
    description: 'Debug mode. Keeps the electron renderer open.',
  },
];

module.exports = Renderer;

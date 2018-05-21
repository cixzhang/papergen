
const PageSizes = require('./pageSizes');

class Renderer {
  constructor(options) {
    this.pages = [];

    this.pageSize = PageSizes.getSize(options.pageSize);
    if (options.landscape) {
      this.pageSize = PageSizes.toLandscape(this.pageSize);
    } else if (options.portrait) {
      this.pageSize = PageSizes.toPortrait(this.pageSize);
    }
    this.pageSizePx = PageSizes.toPixels(this.pageSize);

    this.options = options;
    this.initialize();
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
      .page {
        width: ${dpx[0]}px;
        height: ${dpx[1]}px;
        border: 1px solid lightgrey;
      }
    `];
    rules.forEach(rule => stylesheet.addRule(rule));
  }

  createPage() {
    const body = document.body;
    const newPage = document.createElement('div');
    newPage.classList.add('page');

    body.appendChild(newPage);
    this.pages.push(newPage);

    return newPage;
  }

  renderPage(page) {
    const pageEl = this.createPage();
    page.validateOptions(this.options);
    page.render(pageEl, this.options);
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
    options: 'ppi',
    type: 'Int',
    default: PageSizes.PPI,
    description: 'Pixels per inch.'
  }
];

module.exports = Renderer;

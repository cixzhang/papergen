
const { JSDOM } = require('jsdom');
const HTMLToPDF = require('html5-to-pdf');
const PageSizes = require('./pageSizes');

class Renderer {
  constructor(options) {
    this.dom = new JSDOM();
    this.pages = [];

    this.pageSize = PageSizes.getSize(options.pageSize);
    if (options.landscape) {
      this.pageSize = PageSizes.toLandscape(this.pageSize);
    } else if (options.portrait) {
      this.pageSize = PageSizes.toPortrait(this.pageSize);
    }
    this.pageSizePx = PageSizes.toPixels(this.pageSize);

    this.options = options;
  }

  clear() {
    const document = this.dom.window.document;
    const style = document.createElement('style');
    style.type = 'text/css';

    document.body.innerHTML = '';
    document.body.appendChild(style);
    this.setupCSS();
    this.pages = [];
  }

  setupCSS(style) {
    const dpx = this.pageSizePx;
    const document = this.dom.window.document;
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

  toHTML() {
    return Promise.resolve(this.dom.serialize());
  }

  toPDF() {
    // Dimensions in microns
    const dimensions = this.pageSize.map(v => v * 1000);
    return this.toHTML().then(html => {
      const htmlToPDF = new HTMLToPDF({
        inputBody: html,
        options: {
          pageSize: {
            width: dimensions[0],
            height: dimensions[1],
          },
        },
      });

      return new Promise((res, rej) => {
        htmlToPDF.build((err, buf) => {
          if (err) rej(err);
          res(buf);
        });
      });
    });
  }

  createPage() {
    const document = this.dom.window.document;
    const body = document.body;
    const newPage = document.createElement('div');
    newPage.classList.add('page');

    body.appendChild(newPage);
    this.pages.push(newPage);

    return newPage;
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
  }
];

module.exports = Renderer;



const { JSDOM } = require('jsdom');
const HTMLToPDF = require('html5-to-pdf');

class Renderer {
  constructor() {
    this.dom = new JSDOM();
    this.pages = [];
  }

  clear() {
    const document = this.dom.window.document;
    const body = document.body;

    body.innerHTML = '';
    this.pages = [];
  }

  toHTML() {
    return Promise.resolve(this.dom.serialize());
  }

  toPDF() {
    return this.toHTML().then(html => {
      const htmlToPDF = new HTMLToPDF({
        inputBody: html,
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

    body.appendChild(newPage);
    this.pages.push(newPage);

    return newPage;
  }
}

module.exports = Renderer;


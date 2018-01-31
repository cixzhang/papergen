
const { JSDOM } = require('jsdom');

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
    // TODO: write HTML file
  }

  toPDF() {
    // TODO: convert all pages to pdf
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


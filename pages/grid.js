
const Page = require('../lib/page');
const PageSizes = require('../lib/pageSizes');

const grid = new Page({
  name: 'Grid',
  description: 'Draws a grid page.',
  inputs: [
    {
      key: 'grid_size',
      name: 'Grid Size',
      description: 'The size of each square in the grid.',
      type: 'number',
      initial: 5,
      min: 1,
      max: 10,
      unit: 'mm',
    },
  ],
  render: (el, options) => {
    const rect = el.getBoundingClientRect();
    const {width, height} = rect;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    const gridSize = PageSizes.toPixelsFromMM([5], options.ppi)[0];
    // TODO: debug this
    for (let x = gridSize; x < width; x += gridSize) {
      for (let y = gridSize; y < height; y += gridSize) {
        const hline = document.createElementNS(ns, 'line');
        hline.setAttributeNS(ns, 'x1', 0);
        hline.setAttributeNS(ns, 'x2', width);
        hline.setAttributeNS(ns, 'y1', y);
        hline.setAttributeNS(ns, 'y2', y);
        hline.setAttributeNS(ns, 'stroke', 'black');

        const vline = document.createElement('line');
        vline.setAttributeNS(ns, 'x1', x);
        vline.setAttributeNS(ns, 'x2', x);
        vline.setAttributeNS(ns, 'y1', 0);
        vline.setAttributeNS(ns, 'y2', height);
        vline.setAttributeNS(ns, 'stroke', 'black');

        svg.appendChild(hline);
        svg.appendChild(vline);
      }
    }

    svg.style.width = '100%';
    svg.style.height = '100%';
    el.appendChild(svg);
  },
});

module.exports = grid;


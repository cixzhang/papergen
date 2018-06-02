
const Page = require('../lib/page');
const PageSizes = require('../lib/pageSizes');
const d3 = require('d3-selection');

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

    const d3Svg = d3.select(svg);

    d3Svg.attr('width', '100%');
    d3Svg.attr('height', '100%');

    const maskId = `grid-mask-${gridSize}-${width}-${height}`;
    const patternId = `grid-pattern-${gridSize}`;
    const patternExists = patternId in grid.patterns;
    const maskExists = maskId in grid.masks;

    if (!maskExists || !patternExists) {
      const d3Defs = d3Svg.append('defs');
      if (!patternExists) {
        const d3Pattern = d3Defs.append('pattern')
          .attr('id', patternId)
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', gridSize)
          .attr('height', gridSize)
          .attr('patternUnits', 'userSpaceOnUse');
        const d3PatternHLine = d3Pattern.append('line')
          .attr('x1', 0)
          .attr('x2', '100%')
          .attr('y1', 1)
          .attr('y2', 1)
          .attr('stroke', 'white');
        const d3PatternVLine = d3Pattern.append('line')
          .attr('y1', 0)
          .attr('y2', '100%')
          .attr('x1', 1)
          .attr('x2', 1)
          .attr('stroke', 'white');
      }
      if (!maskExists) {
        const d3Mask = d3Defs.append('mask')
          .attr('id', maskId)
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', 1)
          .attr('height', 1)
        const d3MaskRect = d3Mask.append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', width)
          .attr('height', height)
          .attr('fill', `url(#${patternId})`);
      }
    }

    d3Svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'black')
      .attr('mask', `url(#${maskId})`);

    el.appendChild(svg);
  },
});

grid.masks = {};
grid.patterns = {};

module.exports = grid;


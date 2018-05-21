
const Page = require('../lib/page');

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
    console.log(options);
  },
});

module.exports = grid;



const _ = require('lodash');
const Grid = require('../pages/grid');
const Booklet = require('../lib/booklet');

const colors = ['red', 'lightcoral', 'lightpink', 'pink', 'palevioletred', 'tomato'];
const numPages = 10;

const pages = [];

for (let i = 0; i < numPages; i++) {
  pages.push({
    module: Grid,
    options: {
      gridSize: 10,
      gridColor: _.sample(colors),
    }
  })
}

module.exports = new Booklet({
  pages,
  options: {pageSize: 'A5'},
});

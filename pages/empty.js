
const Page = require('../lib/page');

const empty = new Page({
  name: 'Empty',
  description: 'Renders an empty page.',
  render: (renderer) => {
    renderer.createPage();
  },
});

module.exports = empty;


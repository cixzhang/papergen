
const Page = require('../lib/page');

const empty = new Page({
  name: 'Empty',
  description: 'Renders an empty page.',
  render: () => {},
});

module.exports = empty;


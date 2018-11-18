
const Page = require('../lib/page');

const empty = new Page({
  name: 'Empty',
  filename: __filename,
  description: 'Renders an empty page.',
  render: () => {},
});

module.exports = empty;

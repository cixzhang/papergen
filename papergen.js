// Papergen

const cli = require('./lib/cli');
const papergen = {
  Page: require('./lib/page'),
};

if (require.main === module) {
  cli(process.argv);
}

module.exports = papergen;


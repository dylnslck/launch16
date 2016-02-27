const ncp = require('ncp');

module.exports = dir => {
  ncp('./templates/**/*', dir || './', err => {
    console.error(err);
  });
};

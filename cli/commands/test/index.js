/* eslint no-console: 0 */

const i = require('i');

module.exports = (method, endpoint, data) => {
  // validate the method
  if (/^(get|post|patch|delete)$/i.test(method)) {
    console.error('invalid argument `method`', method);
    process.exit(1);
  }

  // validate the endpoint
  if (Object.keys(require('./schemas.json')).indexOf(i.pluralize(endpoint)) === -1) {
    console.error('invalid argument `endpoint`', endpoint);
    process.exit(1);
  }
};

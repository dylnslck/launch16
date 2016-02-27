/* eslint no-console: 0 */

module.exports = function error() {
  const args = Array.prototype.slice.call(arguments); // eslint-disable-line prefer-rest-params
  console.error.apply(this, args);
  process.exit(1);
};

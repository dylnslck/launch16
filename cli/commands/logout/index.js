/* eslint no-console: 0 */

const Firebase = require('firebase');
const fs = require('fs-extra');

module.exports = () => {
  const ref = new Firebase('https://restle-launch2016.firebaseio.com/');
  ref.unauth();
  fs.removeSync(`${__dirname}/../../.session`);
  console.log('Logout success!');
  process.exit(0);
};

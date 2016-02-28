/* eslint no-console: 0 */

require('dotenv').config();
const Firebase = require('firebase');
const fs = require('fs');

module.exports = () => {
  const ref = new Firebase(process.env.FIREBASE_REF_URL);
  ref.unauth();
  fs.unlinkSync(`${__dirname}/../../.session`);
  console.log('Logout success!');
  process.exit(0);
};

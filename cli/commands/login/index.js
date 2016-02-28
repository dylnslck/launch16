/* eslint no-console: 0 */

const Firebase = require('firebase');
const fs = require('fs');
require('dotenv').config();

const login = require('./login');

const ref = new Firebase(process.env.FIREBASE_REF_URL);

module.exports = () => {
  login()
    .then(auth => ref.authWithCustomToken(auth.token))
    .then(authResult => {
      fs.writeFileSync(`${__dirname}/../../.session`, JSON.stringify(authResult, null, 2));
      console.log('Login success!');
      process.exit(0);
    }).catch(() => {
      console.error('Login failed!');
      process.exit(1);
    });
};

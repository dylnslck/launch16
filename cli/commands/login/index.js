/* eslint no-console: 0 */

require('dotenv').config();
const Firebase = require('firebase');
const fs = require('fs');

const login = require('./login');

module.exports = () => {
  const ref = new Firebase(process.env.FIREBASE_REF_URL);

  login()
    .then(auth => ref.authWithCustomToken(auth.token))
    .then(auth => {
      ref.child(`users/${auth.uid}`).update({ provider: auth.provider });
      fs.writeFileSync(`${__dirname}/../../.session`, JSON.stringify(auth, null, 2));
      console.log('Login success!');
      process.exit(0);
    }).catch(err => {
      console.error('Login failed!');
      console.error(err.message);
      process.exit(1);
    });
};

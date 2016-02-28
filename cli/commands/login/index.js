/* eslint no-console: 0 */

require('dotenv').config();
const Firebase = require('firebase');
const FirebaseTokenGenerator = require('firebase-token-generator');
const fs = require('fs');
const path = require('path');

const generator = new FirebaseTokenGenerator(process.env.FIREBASE_SECRET);
const ref = new Firebase('https://restle-launch2016.firebaseio.com');

module.exports = () => {
  const token = generator.createToken({ uid: 'restle' });
  ref.authWithCustomToken(token, (err, authData) => {
    if (err) {
      console.error('Authentication failed!', err);
      process.exit(1);
    } else {
      fs.writeFileSync(path.resolve(__dirname, '../../.login'), JSON.stringify(authData, null, 2));
      process.exit(0);
    }
  });
};

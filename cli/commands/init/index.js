/* eslint no-console: 0 */

require('dotenv').config();
const Firebase = require('firebase');
const fs = require('fs-extra');
const path = require('path');

const serialize = require('./serialize');

module.exports = name => {
  // scaffold the app
  fs.mkdirpSync(path.resolve(name));
  fs.copySync(`${__dirname}/templates/index.js`, path.resolve(name, 'index.js'));
  fs.copySync(`${__dirname}/templates/package.json`, path.resolve(name, 'package.json'));
  fs.copySync(`${__dirname}/templates/schemas.json`, path.resolve(name, 'schemas.json'));

  // make a new app in Firebase
  const ref = new Firebase(process.env.FIREBASE_REF_URL);
  const auth = fs.readJsonSync(`${__dirname}/../../.session`, { throws: false });
  if (auth) {
    ref.authWithCustomToken(auth.token);
  } else {
    console.error('Initialization failed!');
    console.error('Not authenticated.');
    console.error('Run `restle login` to log in.');
    process.exit(1);
  }
  ref.child('apps').push({ owner: auth.uid, name }).then(app => {
    // deploy the newly created folder structure
    app.child('image').set(serialize(path.resolve(name)));

    app.child('isDeploying').on('value', snapshot => {
      if (snapshot.val()) {
        console.log('Deploying...');
      } else {
        console.log('Deployed!');
        process.exit(0);
      }
    });
  }).catch(err => {
    console.error('Initialization failed!');
    console.error(err.message);
    process.exit(1);
  });
};

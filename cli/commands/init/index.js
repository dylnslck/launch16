require('dotenv').config();
const Firebase = require('firebase');
const fs = require('fs-extra');
const path = require('path');

module.exports = name => {
  // scaffold the app
  fs.mkdirpSync(path.resolve(name));
  fs.copySync(`${__dirname}/templates/index.js`, path.resolve(name, 'index.js'));
  fs.copySync(`${__dirname}/templates/package.json`, path.resolve(name, 'package.json'));

  // make a new app in Firebase
  const ref = new Firebase(process.env.FIREBASE_REF_URL);
  const auth = fs.readJsonSync(`${__dirname}/../../.session`, { throws: false });
  if (auth) {
    ref.authWithCustomToken(auth.token);
  }
  ref.child('apps').push({ owner: auth.uid, name }).then(app => {
    console.log('Deploying...');
    app.child('isDeploying').once('value', snapshot => {
      snapshot.ref().once('value', () => {
        process.exit(0);
      });
    });
  }).catch(err => {
    console.error('Initialization failed!');
    console.error(err.message);
    process.exit(1);
  });
};

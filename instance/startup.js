'use strict';

const Firebase = require('firebase');
const fs = require('fs-extra');
const path = require('path');
const proc = require('child_process');
const appId = process.env.APP_ID || '-KBYPhy_Q7EtKQC74CuH';
const appRef = new Firebase(`https://restle-launch2016.firebaseio.com/apps/${appId}`);

const build = image => {
  Object.keys(image).forEach(key => {
    const name = new Buffer(key, 'base64').toString('ascii');
    const file = new Buffer(image[key], 'base64').toString('ascii');
    fs.outputFileSync(path.resolve(__dirname, 'dist', name), file);
  });
};

let child;

// when the app image changes, reinstantiate the restle app
appRef.child('image').on('value', snapshot => {
  build(snapshot.val());

  if (child && child.connected) {
    child.disconnect();
  }

  proc.execSync('cd ~/launch16/instance/dist/app && npm install');
  child = proc.spawn('node', [path.resolve(__dirname, 'dist/app', 'index.js')]);

  child.stdout.on('data', data => process.stdout.write(data));
  child.stderr.on('data', data => process.stderr.write(data));
});

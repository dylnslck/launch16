'use strict';

const Firebase = require('firebase');
const rp = require('request-promise');
const fs = require('fs-extra');
const path = require('path');
const proc = require('child_process');
const appId = process.env.APP_ID;
const appRef = new Firebase(`https://restle-launch2016.firebaseio.com/apps/${appId}`);

const metaDataUrl = 'http://169.254.169.254/latest/dynamic/instance-identity/document';
const region = 'us-east-1';

const build = image => {
  Object.keys(image).forEach(key => {
    const name = new Buffer(key, 'base64').toString('ascii');
    const file = new Buffer(image[key], 'base64').toString('ascii');
    fs.outputFileSync(path.resolve(__dirname, 'dist', name), file);
  });
};

let child;

rp(metaDataUrl).then(content => {
  const instanceId = proc.execSync('ec2metadata --instance-id', { encoding: 'utf-8' });
  console.log('instanceId', instanceId);
  console.log('content:', content);
  process.env.PORT = 8000;
  return content;
}).then(content => {
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
});

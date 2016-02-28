'use strict';

const Firebase = require('firebase');
const rp = require('request-promise');
const fs = require('fs-extra');
const path = require('path');
const proc = require('child_process');

const metaDataUrl = 'http://169.254.169.254/latest/dynamic/instance-identity/document';

const build = image => {
  Object.keys(image).forEach(key => {
    const name = new Buffer(key, 'base64').toString('ascii');
    const file = new Buffer(image[key], 'base64').toString('ascii');
    fs.outputFileSync(path.resolve(__dirname, 'dist', name), file);
  });
};

let child;
let appRef;

rp({ json: true, uri: metaDataUrl }).then(content => {
  const instanceId = content.instanceId;
  const getApp = `aws ec2 describe-tags --filters "Name=resource-id,Values=${instanceId}" "Name=key,Values=AppId" --region=us-east-1 --output=text | cut -f5`;
  const getUser = `aws ec2 describe-tags --filters "Name=resource-id,Values=${instanceId}" "Name=key,Values=UserId" --region=us-east-1 --output=text | cut -f5`;
  proc.execSync('sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8000');
  const appId = proc.execSync(getApp, { encoding: 'utf-8' }).replace('\n', '');
  const userId = proc.execSync(getUser, { encoding: 'utf-8' }).replace('\n', '');

  appRef = new Firebase('https://restle-launch2016.firebaseio.com/apps/' + appId);

  process.env.USER_ID = userId;
  process.env.APP_ID = appId;
  process.env.PORT = 8000;
}).then(() => {
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

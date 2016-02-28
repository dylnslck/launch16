/* eslint no-console: 0 */

'use strict';

const Firebase = require('firebase');
const AWS = require('aws-sdk');
const express = require('express');
const app = express();
app.listen(process.env.PORT);

const RESTLE_IMAGE = 'ami-0a0a3560'; // restle-9
const RESTLE_EC2 = 't2.micro';

AWS.config.region = 'us-east-1';

const ref = new Firebase('https://restle-launch2016.firebaseio.com');
const ec2 = new AWS.EC2();

const init = (appName, userId, appId) => new Promise((resolve, reject) => {
  let params = {
    ImageId: RESTLE_IMAGE,
    InstanceType: RESTLE_EC2,
    MinCount: 1, MaxCount: 1,
  };

  return ec2.runInstances(params, (err, data) => {
    if (err) return reject(err);

    const instanceId = data.Instances[0].InstanceId;

    params = {
      Resources: [instanceId],
      Tags: [{
        Key: 'Name', Value: appName,
      }, {
        Key: 'UserId', Value: userId,
      }, {
        Key: 'AppId', Value: appId,
      }],
    };

    return ec2.createTags(params, tagErr => {
      if (tagErr) return reject(tagErr);

      return resolve();
    });
  });
});

let deployed = false;
ref.child('apps').on('child_added', snapshot => {
  if (!deployed) return;

  const val = snapshot.val();
  const appId = snapshot.key();
  const appName = val.name;
  const owner = val.owner;

  ref.child(`users/${owner}/currentApp`).set(appId);
  ref.child(`users/${owner}/apps`).once('value', s => {
    s.ref().set({ [snapshot.key()]: true });
  });

  init(appName, owner, appId).then(() => {
    console.log('Instance created!');
  });
});
ref.child('apps').once('value', () => {
  deployed = true;
});

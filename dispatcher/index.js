'use strict';

const Firebase = require('firebase');
const AWS = require('aws-sdk');

const RESTLE_IMAGE = 'ami-2c221d46'; // restle-instance-5
const RESTLE_EC2 = 't2.micro';

AWS.config.region = 'us-east-1';

const ref = new Firebase('https://restle-launch2016.firebaseio.com');

const init = (appName, userId, appId) => new Promise((resolve, reject) => {
  const ec2 = new AWS.EC2();

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

ref.child('apps').on('child_added', snapshot => {
  const val = snapshot.val();
  const appId = snapshot.key();

  const appName = val.name;
  const owner = val.owner;

  ref.child(`users/${owner}`).child('currentApp').set(appId);

  init(appName, owner, appId).then(() => {
    console.log('Instane created!');
  });
});

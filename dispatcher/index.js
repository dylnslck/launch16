'use strict';

const Firebase = require('firebase');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AWS = require('aws-sdk');

const port = process.env.PORT || 3000;
const app = express();

const RESTLE_IMAGE = 'ami-2c695646';
const RESTLE_EC2 = 't2.micro';

AWS.config.region = 'us-east-1';

app.use(bodyParser.json());
app.use(cors());

app.post('/login', (req, res, next) => {

});

app.post('/app', (req, res, next) => {

});

// create an EC2 instance with the appropriate data
app.post('/init', (req, res, next) => {
  const ec2 = new AWS.EC2();

  const appName = req.body.appName;
  const userId = req.body.userId;
  const appId = req.body.appId;

  const ref = new Firebase('https://myprojectname.firebaseIO-demo.com/');

  let params = {
    ImageId: RESTLE_IMAGE,
    InstanceType: RESTLE_EC2,
    MinCount: 1, MaxCount: 1,
  };

  ec2.runInstances(params, (err, data) => {
    if (err) return res.status(500).json(err);

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

    ec2.createTags(params, tagErr => {
      if (tagErr) return res.status(500).json(tagErr);
      return res.json({ success: true })
    });
  });
});

app.listen(port);
console.log(`Listening on port ${port}.`);

'use strict';

const Firebase = require('firebase');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AWS = require('aws-sdk');
const port = process.env.PORT || 3000;
const app = express();

AWS.config.region = 'us-east-1';

app.use(bodyParser.json());
app.use(cors());

app.post('/login', (req, res, next) => {

});

app.post('/app', (req, res, next) => {

});

app.post('/deploy', (req, res, next) => {
  const ec2 = new AWS.EC2();

  const appName = req.body.appName;
  const userId = req.body.userId;
  const appId = req.body.appId;
  const image = req.body.image;

  let params = {
    ImageId: 'ami-3b8bb751', // restle-image-1
    InstanceType: 't2.micro',
    MinCount: 1, MaxCount: 1,
  };

  // Create the instance
  ec2.runInstances(params, (err, data) => {
    if (err) { console.log("Could not create instance", err); return; }

    const instanceId = data.Instances[0].InstanceId;

    // Add tags to the instance
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
      console.log("Tagging instance", tagErr ? "failure" : "success");
    });
  });
});

app.listen(port);
console.log(`Listening on port ${port}.`);

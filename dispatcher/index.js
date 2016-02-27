'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AWS = require('aws-sdk');

const port = process.env.PORT || 3000;
const app = express();

AWS.config.region = 'us-east-1';

app.use(bodyParser.json());
app.use(cors());

app.post('/instantiate', (req, res, next) => {
  const ec2 = new AWS.EC2();
  const name = req.body.name || 'random-name';
  const user = req.body.user || '12345';
  const appId = req.body.app || 'app';

  let params = {
    ImageId: 'ami-e29ba788', // restle-image-1
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
        Key: 'Name', Value: name,
      }, {
        Key: 'UserId', Value: user,
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

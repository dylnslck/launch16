const path = require('path');
const request = require('superagent');
const fs = require('fs');
const Firebase = require('firebase');

const ref = new Firebase('https://restle-launch2016.firebaseio.com');

const getAuth = () => require(path.resolve(__dirname, '../../login.json'), 'utf-8');

const mkdirp = (fn => dir => new Promise((resolve, reject) => {
  fn(dir, err => {
    if (err) return reject(err);
    return resolve();
  });
}))(require('mkdirp'));

const ncp = (fn => (source, destination) => new Promise((resolve, reject) => {
  fn(source, destination, err => {
    if (err) return reject(err);
    return resolve();
  });
}))(require('ncp'));

module.exports = n => {
  const name = n.toLowerCase().replace(/[\s\n]+/g, '-').concat(Date.now());
  mkdirp(path.resolve(name)).then(err => {
    if (err) return Promise.reject(err);
    return Promise.resolve();
  }).then(() => Promise.all([
    ncp(path.resolve(__dirname, 'templates/index.js'), path.resolve(name, 'index.js')),
    ncp(path.resolve(__dirname, 'templates/package.json'), path.resolve(name, 'package.json')),
  ])).then(() => ref.child('apps').push({
    name,
    owner: getAuth().uid,
    isCurrent: true,
    isDeploying: false,
    url: name,
  })).then(app => new Promise((resolve, reject) => {
    fs.writeFileSync(path.resolve(__dirname, '../../.app'), app.key());
    request
      .post('http://localhost:5000/init')
      .type('application/json')
      .send({
        userId: getAuth().uid,
        appId: app.key(),
        appName: name,
      })
      .end(err => {
        if (err) reject(err);
        else resolve();
      });
  })).then(() => {
    process.exit(0);
  }).catch(err => {
    console.error(err);
    console.log(err.message);
    console.log(err.status);
    process.exit(1);
  });
};

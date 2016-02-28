const path = require('path');

const mkdirp = (fn => dir => new Promise((resolve, reject) => {
  fn(dir, err => {
    if (err) return reject(err);
    return resolve();
  });
}))(require('mkdirp'));

const ncp = (fn => (source, destination) => new Promise((resolve, reject) => {
  fn(source, destination, err => {
    if (err) return reject(err);
    return Promise.resolve();
  });
}))(require('ncp'));

module.exports = dir => {
  mkdirp(path.resolve(dir || '.')).then(err => {
    if (err) return Promise.reject(err);
    return Promise.resolve();
  }).then(() => {
    return Promise.all([
      ncp(path.resolve(__dirname, 'templates/index.js'), path.resolve(dir, 'index.js')),
      ncp(path.resolve(__dirname, 'templates/package.json'), path.resolve(dir, 'package.json')),
    ]);
  }).then(promises => {
    console.log(promises);
  }).catch(err => {
    console.error(err);
  });
};

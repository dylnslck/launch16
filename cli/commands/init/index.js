const promisify = fn => function () { // eslint-disable-line func-names
  return new Promise(resolve => {
    const args = Array.prototype.slice.call(arguments); // eslint-disable-line prefer-rest-params
    args.push(resolve);
    fn.apply(this, args);
  });
};

const mkdirp = promisify(require('mkdirp'));
const ncp = promisify(require('ncp'));
const path = require('path');

module.exports = dir => {
  mkdirp(path.resolve(dir)).then(err => {
    if (err) return Promise.reject(err);
    return Promise.resolve();
  }).then(() => Promise.all([
    ncp(path.resolve(__dirname, 'templates/index.js'), path.resolve(dir, 'index.js')),
    ncp(path.resolve(__dirname, 'templates/package.json'), path.resolve(dir, 'package.json')),
  ])).catch(err => {
    throw err;
  });
};

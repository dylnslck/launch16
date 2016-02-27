/* eslint no-console: 0 */

'use strict';

const mkdirp = require('mkdirp');
const error = require('../error.js');
const ncp = require('ncp');

module.exports = directory => {
  const dir = directory ? directory.replace(/\/?$/, '/') : './';

  mkdirp(dir, e => {
    if (e) error(e);
    else {
      ncp(`${__dirname}/templates/index.js`, `${dir}index.js`, err => {
        if (err) error(err);
      });
      ncp(`${__dirname}/templates/package.json`, `${dir}package.json` || './', err => {
        if (err) error(err);
      });
      ncp(`${__dirname}/templates/schemas.json`, `${dir}schemas.json` || './', err => {
        if (err) error(err);
      });
    }
  });
};

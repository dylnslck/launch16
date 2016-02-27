/* eslint-disable no-console */

'use strict';

const path = require('path');
const fs = require('fs');

const schemasDir = path.resolve('./schemas.json');

const error = msg => {
  console.error(msg);
  process.exit(1);
};

const schema = (action, type) => {
  // validate <action>
  if (['add', 'update', 'delete'].indexOf(action) === -1) error('invalid argument `action`');

  // validate <type>
  if (!/^[a-z0-9]+([-_]*[a-z0-9]+)*$/i.test(type)) error('invalid argument `type`');

  // check that `schemas.json` exists
  let schemas;
  try {
    schemas = require(schemasDir);
  } catch (e) {
    error(`could not find ${schemasDir}`);
  }

  const hasType = schemas.hasOwnProperty(type);

  switch (action) {
    case 'add':
      if (hasType) error(`\`${type}\` schema already exists`);
      schemas[type] = {};
      break;
    case 'update':
      console.log('update');
      break;
    case 'delete':
      if (!hasType) error(`\`${type}\` schema doesn't exist`);
      delete schemas[type];
      break;
    default:
      console.error('unexpected error');
      break;
  }

  // rewrite `schemas.json`
  fs.writeFileSync(schemasDir, JSON.stringify(schemas, null, 2));
};

module.exports = schema;

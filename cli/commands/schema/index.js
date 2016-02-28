'use strict';

const path = require('path');
const fs = require('fs');
const Firebase = require('firebase');

const error = require('./error');
const parse = require('./parse');
const serialize = require('../init/serialize');

module.exports = (action, type, fields) => {
  // validate <action>
  if (!/(add|remove)/.test(action)) error(`invalid argument \`action\` ${action}`);

  // validate <type>
  if (!/^[a-z0-9]+([-_]*[a-z0-9]+)*$/i.test(type)) error(`invalid argument \`type\` ${type}`);

  // check that `schemas.json` exists and make it if it doesn't
  const schemasDir = path.resolve('schemas.json');
  let schemas;
  try {
    schemas = require(schemasDir);
  } catch (e) {
    schemas = {};
  }

  // make sure that `schemas` has `type` being currently modified
  if (!schemas[type]) Object.assign(schemas, { [type]: { attributes: {}, relationships: {} } });

  // run the command
  const s = schemas[type];
  switch (action) {
    case 'add': // eslint-disable-line no-case-declarations
      const schema = parse(schemas, fields);
      s.attributes = Object.assign(
        s.attributes ? s.attributes : {},
        schema.attributes
      );
      s.relationships = Object.assign(
        s.relationships ? s.relationships : {},
        schema.relationships
      );
      break;
    case 'remove':
      // if passed no fields delete the entire schema
      if (fields.length === 0) delete schemas[type];
      // if passed `attributes` delete all attributes
      if (fields.indexOf('attributes') !== -1) s.attributes = {};
      // if passed `relationships` delete all relationships
      if (fields.indexOf('relationships') !== -1) s.relationships = {};
      // delete each field that was passed
      fields.forEach(field => {
        delete s.attributes[field];
        delete s.relationships[field];
      });
      break;
    default:
      error('unexpected error');
      break;
  }

  // rewrite `schemas.json`
  fs.writeFileSync(schemasDir, JSON.stringify(schemas, null, 2));
  const appId = fs.readFileSync(path.resolve(__dirname, '../../.app'), 'utf-8');
  const ref = new Firebase(`https://restle-launch2016.firebaseio.com/apps/${appId}`);
  const serial = serialize(path.resolve('./'));
  // console.log(Object.keys(serial).map(key => {
  //   return {
  //     filename: new Buffer(key, 'base64').toString('utf-8'),
  //     contents: new Buffer(serial[key], 'base64').toString('utf-8'),
  //   }
  // }));
  ref.child('image').set(serial, err => {
    if (err) {
      console.error('Failed to synchronize!')
      process.exit(1);
    } else {
      console.log('Synchronized!');
      process.exit(0);
    }
  });
};

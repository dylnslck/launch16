'use strict';

const path = require('path');
const fs = require('fs');

const error = require('./error');
const typeValidator = require('./Constants').typeValidator;
const parseFields = require('./parseSchemaFields');

const schemasDir = path.resolve('./schemas.json');

module.exports = (action, type, fields) => {
  // validate <action>
  if (!/(add|remove)/.test(action)) error(`invalid argument \`action\` ${action}`);

  // validate <type>
  if (!typeValidator.test(type)) error(`invalid argument \`type\` ${type}`);

  // check that `schemas.json` exists and make it if it doesn't
  let schemas;
  try {
    schemas = require(schemasDir);
  } catch (e) {
    schemas = {};
  }

  // make sure that `schemas` has the one being currently modified
  if (!schemas[type]) Object.assign(schemas, { [type]: { attributes: {}, relationships: {} } });
  const s = schemas[type];

  switch (action) {
    case 'add': // eslint-disable-line no-case-declarations
      const schema = parseFields(schemas, fields);
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
      if (!fields.length) delete schemas[type];
      if (fields.indexOf('attributes') !== -1) s.attributes = {};
      if (fields.indexOf('relationships') !== -1) s.relationships = {};
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
};

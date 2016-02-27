const error = require('./error');

const fieldsError = fields => error('invalid argument `fields`', fields);
const attributeError = attribute => error('invalid argument `attribute`', attribute);
const relationshipError = relationship => error('invalid argument `relationship`', relationship);

module.exports = (schemas, fields) => {
  // make sure the first field is either `attributes` or `relationships`
  if (fields[0] && !/(attributes|relationships)/.test(fields[0])) fieldsError();

  // make sure that there is only one of `attributes` or `relationships`
  if (fields.filter(field => field === 'attributes').length > 1) fieldsError(fields);
  if (fields.filter(field => field === 'relationships').length > 1) fieldsError(fields);

  // get all attributes and relationships
  const ai = fields.indexOf('attributes');
  const ri = fields.indexOf('relationships');
  const attributes = [];
  const relationships = [];
  if (ai !== -1) {
    attributes.concat(ai < ri ?
      fields.slice(ai + 1, ri === -1 ? undefined : ri) :
      fields.slice(ai + 1));
  }
  if (ri !== -1) {
    relationships.concat(ri < ai ?
      fields.slice(ri + 1, ai === -1 ? undefined : ai) :
      fields.slice(ri + 1));
  }

  // make sure that each attribute and relationship is unique
  if (attributes
    .map(attribute => attribute.split(':')[0])
    .some(field =>
      relationships.map(relationship => relationship.split(':')[0])
        .indexOf(field) !== -1)) fieldsError(fields);

  const result = {
    attributes: {},
    relationships: {},
  };

  const typeValidator = /^[a-z0-9]+([-_]*[a-z0-9]+)*$/i;

  // validate and parse attributes
  attributes.forEach(attribute => {
    // check for `field:type` syntax
    const pair = attribute.split(':');
    if (pair.length !== 2) attributeError(attribute);

    const field = pair[0];
    const type = pair[1];
    if (!typeValidator.test(field)) attributeError(attribute);
    if (!/(string|number|boolean|date)/.test(type)) attributeError(attribute);

    Object.assign(result.attributes, { [field]: { type } });
  });

  // validate and parse relationships
  relationships.forEach(relationship => {
    // check for `field:schema:multiplicity` syntax
    const triad = relationship.split(':');
    if (triad.length !== 3) relationshipError(relationship);

    const field = triad[0];
    const schema = triad[1];
    const multiplicity = triad[2];
    if (!typeValidator.test(field)) relationshipError(relationship);
    if (Object.keys(schemas).indexOf(schema) === -1) relationshipError(relationship);
    if (!/(one|many)/.test(multiplicity)) relationshipError(relationship);

    Object.assign(
      result.relationships,
      { [field]: { type: schema, isMany: multiplicity === 'many' } }
    );
  });

  return result;
};

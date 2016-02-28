import DS from 'ember-data';
const attr = DS.attr;
const belongsTo = DS.belongsTo;
const hasMany = DS.hasMany;

export default DS.Model.extend({
  name: attr('string'),
  isCurrent: attr('boolean'),
  isDeploying: attr('boolean'),
  url: attr('string'),
  owner: belongsTo('user'),
  schemas: hasMany('schema'),
  ip: attr('string'),
});

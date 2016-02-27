import DS from 'ember-data';
const attr = DS.attr;
const belongsTo = DS.belongsTo;

export default DS.Model.extend({
  name: attr('string'),
  isCurrent: attr('boolean'),
  owner: belongsTo('user'),
});

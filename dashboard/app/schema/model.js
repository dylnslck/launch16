import DS from 'ember-data';
const attr = DS.attr;
const belongsTo = DS.belongsTo;
const hasMany = DS.hasMany;

export default DS.Model.extend({
  name: attr('string'),
  relationships: hasMany('relationship'),
  attributes: hasMany('attribute'),
  app: belongsTo('app'),
});

import DS from 'ember-data';
const attr = DS.attr;
const hasMany = DS.hasMany;
const belongsTo = DS.belongsTo;

export default DS.Model.extend({
  name: attr('string'),
  username: attr('string'),
  email: attr('string'),
  profilePic: attr('string'),
  apps: hasMany('app'),
  currentApp: belongsTo('app', { inverse: 'owner' }),
});

import Ember from 'ember';
const computed = Ember.computed;

export default Ember.Component.extend({
  commands: [
    'restle-launch login',
    'restle-launch init launch-2016',
    'cd launch-2016',
    'restle-launch schemas add user attributes name:string',
    'restle-launch open',
  ],

  inputs: computed('commands', function inputs() {
    return this.get('commands');
  }),
});

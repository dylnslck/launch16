import Ember from 'ember';
const computed = Ember.computed;

export default Ember.Component.extend({
  commands: [
    'restle login',
    'restle init super-dope-app',
    'restle schemas add user attributes name:string',
  ],

  inputs: computed('commands', function inputs() {
    return this.get('commands');
  }),
});

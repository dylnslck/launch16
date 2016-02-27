import Ember from 'ember';
const computed = Ember.computed;

export default Ember.Component.extend({
  commands: ['restle login', 'restle init'],

  inputs: computed('commands', function inputs() {
    return this.get('commands');
  }),
});

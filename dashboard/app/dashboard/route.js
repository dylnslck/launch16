import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    return this.get('session.isAuthenticated') || this.transitionTo('index');
  },

  model() {
    return this.get('session.currentUser.currentApp.schemas');
  },
});

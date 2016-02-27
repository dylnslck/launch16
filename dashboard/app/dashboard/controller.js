import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    logout() {
      this.get('session').close().then(() => {
        this.transitionToRoute('index');
      });
    },
  },
});

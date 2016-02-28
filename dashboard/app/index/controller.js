import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    login() {
      this.get('session').open('firebase', { provider: 'github' }).then(data => {

      });
    },
    logout() {
      this.get('session').close();
    },
  },
});

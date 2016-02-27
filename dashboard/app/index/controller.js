import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    login() {
      this.get('session').open('firebase', { provider: 'github' }).then(data => {
        console.log(data.currentUser);
        console.log(this.get('session.currentUser'));
      });
    },
    logout() {
      this.get('session').close();
    },
  },
});

import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    logout() {
      this.get('session').close().then(() => {
        this.transitionToRoute('index');
      });
    },

    createApp() {
      const appName = this.get('appName');
      const user = this.get('session.currentUser');

      this.get('store').createRecord('app', { name: appName, owner: user }).save().then(app => {
        user.get('apps').addObject(app);
        user.set('currentApp', app);

        return user.save();
      }).then(savedUser => {
        console.log('savedUser:', savedUser);
      }).catch(err => {
        console.log('err:', err);
      });
    },

    selectApp(app) {
      this.get('session.currentUser').set('currentApp', app);
    },
  },
});

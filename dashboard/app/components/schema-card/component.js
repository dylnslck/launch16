import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['col-xs-12', 'col-sm-6', 'col-md-4', 'col-lg-6'],

  url: Ember.computed('schema', function() {
    const id = `${this.get('schema.id')}s`;
    const ip = this.get('currentUser.currentApp.ip');

    return `${ip}/${id}`;
  }),
});

import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['terminal-input'],
  didExecute: false,

  didInsertElement() {
    const el = this.$();

    el.keydown(e => {
      if (e.keyCode !== 13) return false;


    });

    el.click(e => {

    });
  },
});

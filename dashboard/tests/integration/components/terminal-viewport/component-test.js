import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('terminal-viewport', 'Integration | Component | terminal viewport', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{terminal-viewport}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#terminal-viewport}}
      template block text
    {{/terminal-viewport}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

/* global require, module */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function emberCLIBuild() {
  const app = new EmberApp();

  app.import('bower_components/bootstrap/dist/css/bootstrap.css');
  app.import('bower_components/tether/dist/js/tether.js');
  app.import('bower_components/bootstrap/dist/js/bootstrap.js');

  return app.toTree();
};

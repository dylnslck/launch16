/* eslint no-console: 0 */

const spawn = require('child_process').spawn;

module.exports = () => {
  const start = spawn('node', ['index.js']);

  start.stdout.on('data', data => {
    process.stdout.write(`${data}`);
  });

  start.stderr.on('data', data => {
    process.stderr.write(`${data}`);
  });
};

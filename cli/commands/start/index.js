const spawn = require('child_process').spawn;

module.exports = options => {
  if (options.port) process.env.PORT = parseInt(options.port, 10);
  const start = spawn('node', ['index.js']);
  start.stdout.on('data', data => process.stdout.write(`${data}`));
  start.stderr.on('data', data => process.stderr.write(`${data}`));
};

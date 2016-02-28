const Restle = require('restle');
const schemas = require('./schemas.json');

const app = new Restle({
  port: process.env.PORT || 3000,
});

app.register(schemas);
app.on('ready', () => console.log(`Restle is listening on port ${app.port}`));

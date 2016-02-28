// const request = require('superagent');
// const serialize = require('./serialize');
//
// const dispatcherUrl = 'https://restle-launch2016.herokuapp.com';
//
// module.exports = dir => {
//   const image = serialize(dir || '.');
//   request
//     .post(`${dispatcherUrl}/deploy`)
//     .type('application/json')
//     .send({ image })
//     .end(err => {
//       if (err) console.error(err.message);
//       process.exit(0);
//     });
// };

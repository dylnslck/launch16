const Nightmare = require('nightmare');

module.exports = () => {
  const nightmare = new Nightmare({
    show: true,
    alwaysOnTop: false,
    title: 'Restle',
    waitTimeout: 0,
  });

  const key = 'firebase:session::restle-launch2016';

  return nightmare
    .goto('https://restle-launch2016.firebaseapp.com')
    .wait(k => !!localStorage.getItem(k), key)
    // .evaluate(k => JSON.parse(localStorage.getItem(k)), key)
    .evaluate(k => {
      const auth = JSON.parse(localStorage.getItem(k));
      localStorage.clear();
      return auth;
    }, key)
    .end();
};

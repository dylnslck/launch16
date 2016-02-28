const Nightmare = require('nightmare');
require('dotenv').config();

module.exports = () => {
  const nightmare = new Nightmare({
    show: true,
    alwaysOnTop: false,
  });

  const key = process.env.FIREBASE_LOCAL_STORAGE_AUTH_KEY;

  return nightmare
    .goto(process.env.FIREBASE_APP_URL)
    .wait(k => !!localStorage.getItem(k), key)
    .evaluate(k => JSON.parse(localStorage.getItem(k)), key)
    .end();
};

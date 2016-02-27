const rp = require('request-promise');
const Firebase = require('firebase');

const userId = process.env.USER_ID;
const f = new Firebase('https://restle-launch2016.firebaseio.com/users');

f.once('value', snapshot => {
  console.log(snapshot.val());
});

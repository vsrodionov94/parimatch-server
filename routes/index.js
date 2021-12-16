const checkUser = require('./checkUser');
const sendRepost = require('./sendRepost');
const setAnswer = require('./tryAnswer');

module.exports = app => {
  checkUser(app);
  sendRepost(app);
  setAnswer(app);
};

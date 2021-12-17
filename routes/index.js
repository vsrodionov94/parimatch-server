const checkUser = require('./checkUser');
const getStats = require('./getStats');
const sendRepost = require('./sendRepost');
const tryAnswer = require('./tryAnswer');

module.exports = app => {
  checkUser(app);
  sendRepost(app);
  tryAnswer(app);
  getStats(app);
};

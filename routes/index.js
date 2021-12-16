const checkUser = require('./checkUser');
const getStats = require('./getStats');
const sendRepost = require('./sendRepost');
const setAnswer = require('./tryAnswer');

module.exports = app => {
  checkUser(app);
  sendRepost(app);
  setAnswer(app);
  getStats(app);
};

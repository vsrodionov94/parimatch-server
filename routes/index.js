const checkUser = require('./checkUser');
const getStats = require('./getStats');
const sendRepost = require('./sendRepost');
const tryAnswer = require('./tryAnswer');
const doneTutorial = require('./doneTutorial');
const getAttachment = require('./getAttachment');

module.exports = app => {
  checkUser(app);
  sendRepost(app);
  tryAnswer(app);
  getStats(app);
  doneTutorial(app);
  getAttachment(app);
};

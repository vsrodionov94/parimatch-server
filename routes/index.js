const mongoose = require('mongoose');
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

  app.get('/test', (req, res) => {
    const { db } = mongoose.connection;
    db.dropDatabase();
    console.log('droped');
    res.json({ ok: true });
  });
};

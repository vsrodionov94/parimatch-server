const Statistics = require('../classes/Statistics');
const User = require('../models/user');

module.exports = app => {
  app.post('/sendRepost', (req, res) => {
    const { vkId, repostId } = req.body;
    console.log(req.body);
    User.updateOne({ vkId }, { $set: { lastRepost: repostId } }).then(() => null);
    Statistics.incRepostsCount();
    res.json({ error: false });
  });
};

const Statistics = require('../classes/Statistics');

module.exports = app => {
  app.post('/sendRepost', (req, res) => {
    Statistics.incRepostsCount();
    res.json();
  });
};

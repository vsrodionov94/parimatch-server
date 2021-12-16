const incRepostsCount = require('../functions/incRepostsCount');

module.exports = app => {
  app.post('/sendRepost', () => {
    incRepostsCount();
  });
};

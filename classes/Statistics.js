const Stats = require('../models/stats');

module.exports = class Statistics {
  static incOpenedCount() {
    Stats.updateOne({}, { $inc: { openedCount: 1 } }).then(() => null);
  }

  static incQuestionsCount() {
    Stats.updateOne({}, { $inc: { questionsCount: 1 } }).then(() => null);
  }

  static incRepostsCount() {
    Stats.updateOne({}, { $inc: { repostsCount: 1 } }).then(() => null);
  }

  static incUsersCount() {
    Stats.updateOne({}, { $inc: { usersCount: 1 } }).then(() => null);
  }
};

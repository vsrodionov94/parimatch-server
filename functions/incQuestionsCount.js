const Stats = require('../models/stats');

module.exports = () => {
  Stats.updateOne({}, { $inc: { questionsCount: 1 } }).then(() => null);
};

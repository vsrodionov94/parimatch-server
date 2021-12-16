const Stats = require('../models/stats');

module.exports = () => {
  Stats.updateOne({}, { $inc: { usersCount: 1 } }).then(() => null);
};

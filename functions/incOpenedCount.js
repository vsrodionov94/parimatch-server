const Stats = require('../models/stats');

module.exports = () => {
  Stats.updateOne({}, { $inc: { openedCount: 1 } }).then(() => null);
};

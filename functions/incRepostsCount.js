const Stats = require('../models/stats');

module.exports = () => {
  Stats.updateOne({}, { $inc: { repostsCount: 1 } }).then(() => null);
};

const Stats = require('../models/stats');
const Users = require('../models/user');

module.exports = app => {
  app.get('/getStats', async (req, res) => {
    const statsData = await Stats.findOne({}, { _id: 0, __v: 0 }).then(data => data);
    const usersData = await Users.find({}, {
      _id: 0,
      __v: 0,
      lastDay: 0,
      questions: 0,
      tutorial: 0,
      time: 0,
    }).then(data => data);

    res.json({ stats: statsData, users: usersData });
  });
};

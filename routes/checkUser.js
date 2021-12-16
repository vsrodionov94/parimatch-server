const User = require('../models/user');
const incUsersCount = require('../functions/incUsersCount');
const incOpenedCount = require('../functions/incOpenedCount');

const getNewDay = () => {
  let newDay = new Date();
  newDay.setHours(0);
  newDay.setMinutes(0);
  newDay.setSeconds(0);
  newDay = Math.round(newDay.getTime() / 1000);
  return newDay;
};

module.exports = app => {
  app.post('/checkUser', async (req, res) => {
    const { vkId } = req.body;
    const result = {
      newDay: false,
      questions: [],
      tutorial: true,
    };

    const user = await User.findOne({ vkId }).then(data => data);

    if (user) {
      result.newDay = user.time < getNewDay();
      result.questions = user.questions;
      result.tutorial = user.tutorial;
      user.updateOne({ vkId }, {
        $set: { time: Math.round(new Date().getTime() / 1000) },
      }).then(() => null);
    } else {
      User.create({ vkId }).then(data => data);
      incUsersCount();
    }

    incOpenedCount();
    res.json(result);
  });
};

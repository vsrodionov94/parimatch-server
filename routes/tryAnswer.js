const User = require('../models/user');
const incQuestionsCount = require('../functions/incQuestionsCount');

module.exports = app => {
  app.post('/tryAnswer', async (req, res) => {
    const { vkId, questionId, answer } = req.body;
    let error = false;
    const user = await User.findOne({ vkId }).then(data => data);
    if (user) {
      const question = user.questions.find(el => el.id === questionId);
      if (question) {
        question.answered = true;
        question.correctly = answer;
        user.time = Math.round(new Date().getTime() / 1000);
        user.save();
        incQuestionsCount();
      } else error = true;
    } else error = true;
    res.json({ error });
  });
};

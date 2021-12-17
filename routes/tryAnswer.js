const User = require('../models/user');
const Statistics = require('../classes/Statistics');

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
        if (answer) user.correctAnswers += 1;

        user.save();
        Statistics.incQuestionsCount();
      } else error = true;
    } else error = true;
    res.json({ error });
  });
};

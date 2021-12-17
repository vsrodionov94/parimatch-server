const User = require('../models/user');
const Statistics = require('../classes/Statistics');
const Question = require('../classes/Question');

const ONE_DAY = 86400 * 1000;

const randomInt = (min, max) => Math.round(Math.random() * (max - min) + min);

const getRandomQuestionId = questions => {
  const id = randomInt(1, 36);
  if (questions.length <= 0 || questions.every(el => el.id !== id)) return id;
  const newQuestions = questions.filter(el => el.id !== id);
  return getRandomQuestionId(newQuestions);
};

module.exports = app => {
  app.post('/checkUser', async (req, res) => {
    const { vkId } = req.body;
    const result = {
      questions: [],
      tutorial: false,
    };

    const user = await User.findOne({ vkId }).then(data => data);
    const deltaTime = new Date().getTime() - process.env.START_DAY;
    const currentDay = Math.floor(deltaTime / ONE_DAY);

    if (user) {
      result.tutorial = user.tutorial;
      const offlineDays = user.lastDay - currentDay;

      const questions = [...user.questions];
      if (offlineDays === 1) {
        const lastIndex = questions.length;
        for (let i = lastIndex; i <= lastIndex + 3; i += 1) {
          const id = getRandomQuestionId(questions);
          const position = i;
          result.questions.push(new Question(id, position));
        }
      } else if (offlineDays > 1) {
        const lastIndex = questions.length;
        for (let i = lastIndex; i < lastIndex + currentDay; i += 1) {
          for (let j = 1; j <= 3; j += 1) {
            const id = getRandomQuestionId(questions);
            const position = i + j;
            result.questions.push(new Question(id, position, true));
          }
        }
        for (let i = 1; i <= 3; i += 1) {
          const id = getRandomQuestionId(questions);
          const position = i;
          result.questions.push(new Question(id, position));
        }
      }
      user.updateOne({ vkId }, { $set: { lastDay: currentDay, questions: questions } })
        .then(() => null);
      result.questions = questions;
    } else {
      const questions = [];
      if (currentDay > 0) {
        for (let i = 0; i < currentDay; i += 1) {
          for (let j = 1; j <= 3; j += 1) {
            const id = getRandomQuestionId(questions);
            const position = i + j;
            result.questions.push(new Question(id, position, true));
          }
        }
      }
      const lastIndex = questions.length;
      for (let i = lastIndex; i <= lastIndex + 3; i += 1) {
        const id = getRandomQuestionId(questions);
        const position = i;
        result.questions.push(new Question(id, position));
      }
      User.create({ vkId: vkId, lastDay: currentDay, questions: questions }).then(data => {
        Statistics.incUsersCount();
        return data;
      });
      result.questions = questions;
    }

    Statistics.incOpenedCount();
    res.json(result);
  });
};

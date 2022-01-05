const User = require('../models/user');
const Statistics = require('../classes/Statistics');
const Question = require('../classes/Question');

const ONE_DAY = 86400 * 1000;
const MAX_LENGTH = 36;

const randomInt = (min, max) => Math.round(Math.random() * (max - min) + min);

const getRandomQuestionId = questions => {
  const id = randomInt(1, MAX_LENGTH);
  if (questions.length <= 0 || questions.every(el => el.id !== id)) return id;
  const newQuestions = questions.filter(el => el.id !== id);
  return getRandomQuestionId(newQuestions);
};

const addThreeQuestions = (questions, answered = false) => {
  for (let i = 0; i < 3; i += 1) {
    if (questions.length > MAX_LENGTH) break;
    const id = getRandomQuestionId(questions);
    questions.push(new Question(id, answered));
  }
};

const setAnsweredOldQuestions = questions => {
  questions.forEach(quest => {
    quest.answered = true;
  });
};

module.exports = app => {
  app.post('/checkUser', async (req, res) => {
    const { vkId } = req.body;
    const result = {
      questions: [],
      tutorial: false,
    };

    const user = await User.findOne({ vkId }).then(data => data);
    const currentTime = new Date().getTime();
    const deltaTime = currentTime - process.env.START_DAY;
    const currentDay = Math.floor(deltaTime / ONE_DAY);
    console.log(currentDay);
    if (currentTime > process.env.END_DAY || currentTime < process.env.START_DAY) res.json(result);
    if (user) {
      result.tutorial = user.tutorial;
      const offlineDays = currentDay - user.lastDay;
      const questions = [...user.questions];
      if (questions.length < MAX_LENGTH) {
        if (offlineDays === 1) {
          setAnsweredOldQuestions(questions);
          addThreeQuestions(questions);
        } else if (offlineDays > 1) {
          setAnsweredOldQuestions(questions);
          for (let i = 0; i < currentDay; i += 1) {
            addThreeQuestions(questions, true);
          }
          addThreeQuestions(questions);
        }
      }

      User.updateOne({ vkId }, { $set: { lastDay: currentDay, questions: questions } })
        .then(() => null);
      result.questions = questions;
    } else {
      const questions = [];
      if (currentDay > 0) {
        for (let i = 0; i < currentDay; i += 1) {
          if (questions.length > MAX_LENGTH) break;
          addThreeQuestions(questions, true);
        }
      }
      addThreeQuestions(questions);
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

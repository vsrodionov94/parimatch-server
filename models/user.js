const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  vkId: {
    type: Number,
    required: true,
    index: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
    default: 0,
  },
  questions: {
    type: [{
      id: Number,
      answered: Boolean,
      correctly: Boolean,
    }],
    default: [],
  },
  tutorial: {
    type: Boolean,
    default: false,
    required: true,
  },
  lastDay: {
    type: Number,
    required: true,
    default: 0,
  },
  lastRepost: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model('user', userSchema);

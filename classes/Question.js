module.exports = class Question {
  constructor(id, answered = false) {
    this.id = id;
    this.answered = answered;
    this.correctly = false;
  }
};

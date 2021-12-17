module.exports = class Question {
  constructor(id, position, answered = false, correctly = false) {
    this.id = id;
    this.position = position;
    this.answered = answered;
    this.correctly = correctly;
  }
};

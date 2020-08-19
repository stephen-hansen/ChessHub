/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
class Move {
  constructor(from, to) {
    this.to = to;
    this.from = from;
  }

  getTo() {
    return this.to;
  }

  getFrom() {
    return this.from;
  }

  equals(m) {
    return (this.getTo()[0] === m.getTo()[0] && 
      this.getTo()[1] === m.getTo()[1] &&
      this.getFrom()[0] === m.getFrom()[0] &&
      this.getFrom()[1] === m.getFrom()[1]);
  }
}

module.exports = { Move };

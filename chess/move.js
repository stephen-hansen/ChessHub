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
    return (this.getTo() === m.getTo() && this.getFrom() === m.getFrom());
  }
}

module.exports = Move;

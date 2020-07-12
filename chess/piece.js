/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
class Piece {
  constructor(c, p) {
    this.color = c;
    this.position = p;
    this.active = true;
  }

  isActive() {
    return this.active;
  }

  setActive(a) {
    this.active = a;
  }

  getColor() {
    return this.color;
  }

  getPosition() {
    return this.position;
  }

  setPosition(p) {
    this.position = p;
  }

  getMoves(b) {
    if (new.target === Piece) {
      throw new TypeError('Need to implement getMoves method');
    }
  }

  isValidMove(m, b) {
    const moves = this.getMoves(b);
    return moves.includes(m);
  }
}

module.exports = Piece;

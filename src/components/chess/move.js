/* eslint-disable class-methods-use-this */
const {
  castleLeft,
  castleRight,
  promoteKnight,
  promoteQueen,
  promoteRook,
  promoteBishop,
  moveStandard,
  moveCastle,
  movePromotion,
  moveDraw,
} = require('./constants.js');

class Move {
  constructor(from, to) {
    this.to = to;
    this.from = from;
    this.promotion = null;
    this.castleSide = null;
    this.type = moveStandard;
    this.isCapture = false;
    this.causesCheck = false;
    this.causesCheckmate = false;
    this.isEnPassant = false;
    this.pieceAbbreviation = '';
    this.includeDepFile = false;
    this.includeDepRank = false;
    this.promoteAbbreviation = '';
  }

  setCapture() {
    this.isCapture = true;
  }

  setCheck() {
    this.causesCheck = true;
  }

  setCheckmate() {
    this.causesCheckmate = true;
  }

  setEnPassant() {
    this.isEnPassant = true;
  }

  setDepFile() {
    this.includeDepFile = true;
  }

  setDepRank() {
    this.includeDepRank = true;
  }

  getSAN() {
    // Start with the piece abbreviation
    let san = this.pieceAbbreviation;
    // Draw case
    if (this.getType() === moveDraw) {
      return '(=)';
    }
    // Castle case
    if (this.getType() === moveCastle) {
      if (this.getCastleSide() === castleLeft) {
        san = '0-0-0';
      }
      if (this.getCastleSide() === castleRight) {
        san = '0-0';
      }
    } else {
      const sanTo = this.toSANCoords(this.getTo());
      const sanFr = this.toSANCoords(this.getFrom());
      // Put the file of departure if requested
      if (this.includeDepFile) {
        san += sanFr[0];
      }
      // Put the rank of departure if requested
      if (this.includeDepRank) {
        san += sanFr[1];
      }
      // Put in an x for capture
      if (this.isCapture) {
        san += 'x';
      }

      san += sanTo;
      if (this.getType() === movePromotion) {
        san += this.promoteAbbreviation;
      }

      // If en Passant capture, put e.p. at end
      if (this.isEnPassant) {
        san += ' e.p.';
      }
    }

    // If the move causes check, put + at end
    if (this.causesCheck) {
      san += '+';
    }

    // If the move causes checkmate, put # at end
    if (this.causesCheckmate) {
      san += '#';
    }

    return san;
  }

  getType() {
    return this.type;
  }

  setType(type) {
    this.type = type;
  }

  getPromotion() {
    return this.promotion;
  }

  setPromotion(promotion) {
    this.promotion = promotion;
    switch (promotion) {
      case promoteQueen:
        this.promoteAbbreviation = 'Q';
        break;
      case promoteKnight:
        this.promoteAbbreviation = 'N';
        break;
      case promoteBishop:
        this.promoteAbbreviation = 'B';
        break;
      case promoteRook:
        this.promoteAbbreviation = 'R';
        break;
      default:
        break;
    }
  }

  getCastleSide() {
    return this.castleSide;
  }

  setCastleSide(castleSide) {
    this.castleSide = castleSide;
  }

  toSANCoords(loc) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return files[loc[1]] + ranks[loc[0]];
  }

  getTo() {
    return this.to;
  }

  getFrom() {
    return this.from;
  }

  setPieceAbbreviation(abbrev) {
    this.pieceAbbreviation = abbrev;
  }

  equals(m) {
    return (this.getTo()[0] === m.getTo()[0]
      && this.getTo()[1] === m.getTo()[1]
      && this.getFrom()[0] === m.getFrom()[0]
      && this.getFrom()[1] === m.getFrom()[1]);
  }
}

module.exports = { Move };

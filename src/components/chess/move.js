/* eslint-disable class-methods-use-this */
const {
  castleLeft,
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
  /**
   * @function constructor creates a new move
   * @param {[int]} from moving from location
   * @param {[int]} to moving to location
   * @return Move
   */
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

  /**
   * @function setCapture set if move caused capture
   */
  setCapture() {
    this.isCapture = true;
  }

  /**
   * @function setCheck set if move caused check
   */
  setCheck() {
    this.causesCheck = true;
  }

  /**
   * @function setCheckmate set if move caused checkmate
   */
  setCheckmate() {
    this.causesCheckmate = true;
  }

  /**
   * @function setEnPassant set if move was en passant capture
   */
  setEnPassant() {
    this.isEnPassant = true;
  }

  /**
   * @function setDepFile set if move needs departing file value
   */
  setDepFile() {
    this.includeDepFile = true;
  }

  /**
   * @function setDepRank set if move needs departing rank value
   */
  setDepRank() {
    this.includeDepRank = true;
  }

  /**
   * @function getSAN get the SAN representation of the move
   * @return {String} the SAN representation
   */
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
      } else {
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

  /**
   * @function getType get the type of move
   * @return {String}
   */
  getType() {
    return this.type;
  }

  /**
   * @function setType set the type of move
   * @param {String} type
   */
  setType(type) {
    this.type = type;
  }

  /**
   * @function getPromotion get the piece that pawn promoted to in move
   * @return {String}
   */
  getPromotion() {
    return this.promotion;
  }

  /**
   * @function setPromotion convert promotion key to abbreviation
   * @param {String} promotion key value associated with promotion
   */
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

  /**
   * @function getCastleSide get direction of castle
   * @return {String}
   */
  getCastleSide() {
    return this.castleSide;
  }

  /**
   * @function setCastleSide set direction of castle
   * @param {String} castleSide
   */
  setCastleSide(castleSide) {
    this.castleSide = castleSide;
  }

  /**
   * @function toSANCoords convert a location to SAN coords
   * @param {[int]} loc location as int tuple
   * @return {String} SAN location
   */
  toSANCoords(loc) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return files[loc[1]] + ranks[loc[0]];
  }

  /**
   * @function getTo get to location
   * @return {[int]}
   */
  getTo() {
    return this.to;
  }

  /**
   * @function getFrom get from location
   * @return {[int]}
   */
  getFrom() {
    return this.from;
  }

  /**
   * @function setPieceAbbreviation set abbreviation of piece
   * @param {String} abbrev
   */
  setPieceAbbreviation(abbrev) {
    this.pieceAbbreviation = abbrev;
  }

  /**
   * @function equals check if two moves are equal
   * @param {Move} m
   * @return {bool}
   */
  equals(m) {
    return (this.getTo()[0] === m.getTo()[0]
      && this.getTo()[1] === m.getTo()[1]
      && this.getFrom()[0] === m.getFrom()[0]
      && this.getFrom()[1] === m.getFrom()[1]);
  }
}

module.exports = { Move };

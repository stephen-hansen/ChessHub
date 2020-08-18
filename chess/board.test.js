const { Board } = require('./board.js');
const { Pawn } = require('./pawn.js');
const { King } = require('./king.js');
const { Queen } = require('./queen.js');
const { Knight } = require('./knight.js');
const { Rook } = require('./rook.js');
const { Bishop } = require('./bishop.js');
const { Move } = require('./move.js');
const { black, white } = require('./constants.js');

test('board initializes to default board layout', () => {
  const newBoard = new Board();
  for (let i = 0; i < 8; i += 1) {
    const piece = newBoard.getPiece([1, i]);
    expect(piece.getColor()).toBe(black);
    expect(piece).toBeInstanceOf(Pawn);
    expect(piece.isActive()).toBeTruthy();
    expect(piece.getPosition()).toStrictEqual([1, i]);
  }
  for (let i = 0; i < 8; i += 1) {
    const piece = newBoard.getPiece([6, i]);
    expect(piece.getColor()).toBe(white);
    expect(piece).toBeInstanceOf(Pawn);
    expect(piece.isActive()).toBeTruthy();
    expect(piece.getPosition()).toStrictEqual([6, i]);
  }

  const pieceOrder = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];

  for (let i = 0; i < pieceOrder.length; i += 1) {
    const bPiece = newBoard.getPiece([0, i]);
    expect(bPiece.getColor()).toBe(black);
    expect(bPiece).toBeInstanceOf(pieceOrder[i]);
    expect(bPiece.isActive()).toBeTruthy();
    expect(bPiece.getPosition()).toStrictEqual([0, i]);
    const wPiece = newBoard.getPiece([7, i]);
    expect(wPiece.getColor()).toBe(white);
    expect(wPiece).toBeInstanceOf(pieceOrder[i]);
    expect(wPiece.isActive()).toBeTruthy();
    expect(wPiece.getPosition()).toStrictEqual([7, i]);
  }
});

test('accepted pawn moves', () => {
  const newBoard = new Board();
  // Move white pawns up one
  for (let i = 0; i < 8; i += 1) {
    const move = new Move([6, i], [5, i]);
    expect(newBoard.applyMove(move)).toBeTruthy();
    expect(newBoard.getPiece([6, i])).toBeNull();
    const piece = newBoard.getPiece([5, i]);
    expect(piece).toBeInstanceOf(Pawn);
    expect(piece.getColor()).toBe(white);
    expect(piece.isActive()).toBeTruthy();
    expect(piece.getPosition()).toStrictEqual([5, i]);
  }
  // Move black pawns down one
  for (let i = 0; i < 8; i += 1) {
    const move = new Move([1, i], [2, i]);
    expect(newBoard.applyMove(move)).toBeTruthy();
    expect(newBoard.getPiece([1, i])).toBeNull();
    const piece = newBoard.getPiece([2, i]);
    expect(piece).toBeInstanceOf(Pawn);
    expect(piece.getColor()).toBe(black);
    expect(piece.isActive()).toBeTruthy();
    expect(piece.getPosition()).toStrictEqual([2, i]);
  }
  // Test captures (white -> black)
  const whiteCaptureMoves = [new Move([5, 5], [4, 6]), new Move([5, 5], [4, 4])];

  for (let i = 0; i < whiteCaptureMoves.length; i += 1) {
    const from = whiteCaptureMoves[i].getFrom();
    const to = whiteCaptureMoves[i].getTo();
    const capturer = new Pawn(white, from);
    const captured = new Pawn(black, to);
    const capBoard = new Board();
    capBoard.setBoard([new King(white, [7, 0]),
      new King(black, [0, 0]),
      capturer,
      captured]);
    expect(capBoard.applyMove(whiteCaptureMoves[i])).toBeTruthy();
    expect(captured.isActive()).toBeFalsy();
    expect(capturer.isActive()).toBeTruthy();
    expect(capturer.getPosition()).toStrictEqual(to);
    expect(capBoard.getPiece(to)).toBe(capturer);
    expect(capBoard.getPiece(from)).toBeNull();
  }

  // Test captures (black -> white)
  const blackCaptureMoves = [new Move([5, 5], [6, 6]), new Move([5, 5], [6, 4])];

  for (let i = 0; i < blackCaptureMoves.length; i += 1) {
    const from = blackCaptureMoves[i].getFrom();
    const to = blackCaptureMoves[i].getTo();
    const capturer = new Pawn(black, from);
    const captured = new Pawn(white, to);
    const capBoard = new Board();
    capBoard.setBoard([new King(white, [7, 0]),
      new King(black, [0, 0]),
      capturer,
      captured]);
    expect(capBoard.applyMove(blackCaptureMoves[i])).toBeTruthy();
    expect(captured.isActive()).toBeFalsy();
    expect(capturer.isActive()).toBeTruthy();
    expect(capturer.getPosition()).toStrictEqual(to);
    expect(capBoard.getPiece(to)).toBe(capturer);
    expect(capBoard.getPiece(from)).toBeNull();
  }
});

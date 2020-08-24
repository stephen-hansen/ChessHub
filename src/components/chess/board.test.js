const { Board } = require('./board.js');
const { Pawn } = require('./pawn.js');
const { King } = require('./king.js');
const { Queen } = require('./queen.js');
const { Knight } = require('./knight.js');
const { Rook } = require('./rook.js');
const { Bishop } = require('./bishop.js');
const { Move } = require('./move.js');
const { Piece } = require('./piece.js');
const {
  black,
  white,
  castleLeft,
  castleRight,
  promoteQueen,
  promoteKnight,
  promoteRook,
  promoteBishop,
} = require('./constants.js');

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

  expect(newBoard.getHistory().length).toBe(0);
  expect(newBoard.getBoard()).not.toBeNull();
});

test('accepted pawn moves', () => {
  const newBoard = new Board();
  // Move white pawns up one
  for (let i = 0; i < 8; i += 1) {
    const move = new Move([6, i], [5, i]);
    newBoard.setTurn(white);
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
    newBoard.setTurn(black);
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
    capBoard.setTurn(white);
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
    capBoard.setTurn(black);
    expect(capBoard.applyMove(blackCaptureMoves[i])).toBeTruthy();
    expect(captured.isActive()).toBeFalsy();
    expect(capturer.isActive()).toBeTruthy();
    expect(capturer.getPosition()).toStrictEqual(to);
    expect(capBoard.getPiece(to)).toBe(capturer);
    expect(capBoard.getPiece(from)).toBeNull();
  }
});

test('rejected pawn moves', () => {
  const board = new Board();
  let pawn = new Pawn(white, [5, 5]);
  board.setBoard([new King(white, [7, 0]), new King(black, [0, 0]), pawn]);
  let illegalMoveTos = [[2, 5], [4, 4], [4, 6], [5, 6], [5, 4], [6, 5], [6, 4], [6, 6]];
  // Testing some basic illegal white pawn moves
  for (let i = 0; i < illegalMoveTos.length; i += 1) {
    const move = new Move([5, 5], illegalMoveTos[i]);
    board.setTurn(white);
    expect(board.applyMove(move)).toBeFalsy();
    expect(board.getPiece(illegalMoveTos[i])).toBeNull();
    expect(board.getPiece([5, 5])).toBe(pawn);
  }
  pawn = new Pawn(black, [4, 4]);
  board.setBoard([new King(white, [7, 0]), new King(black, [0, 0]), pawn]);
  illegalMoveTos = [[7, 4], [5, 3], [5, 5], [4, 3], [4, 5], [3, 4], [3, 3], [3, 5]];
  // Testing some basic illegal black pawn moves
  for (let i = 0; i < illegalMoveTos.length; i += 1) {
    const move = new Move([4, 4], illegalMoveTos[i]);
    board.setTurn(black);
    expect(board.applyMove(move)).toBeFalsy();
    expect(board.getPiece(illegalMoveTos[i])).toBeNull();
    expect(board.getPiece([4, 4])).toBe(pawn);
  }
  pawn = new Pawn(white, [5, 5]);
  board.setBoard([new King(white, [7, 0]), new King(black, [0, 0]), pawn,
    new Pawn(white, [4, 5]), new Pawn(white, [4, 4]), new Pawn(white, [4, 6])]);
  illegalMoveTos = [[4, 5], [4, 4], [4, 6]];
  // Now for illegal captures
  for (let i = 0; i < illegalMoveTos.length; i += 1) {
    const move = new Move([5, 5], illegalMoveTos[i]);
    board.setTurn(white);
    expect(board.applyMove(move)).toBeFalsy();
    const piece = board.getPiece(illegalMoveTos[i]);
    expect(piece.getColor()).toBe(white);
    expect(piece.isActive()).toBeTruthy();
    expect(piece).toBeInstanceOf(Pawn);
    expect(board.getPiece([5, 5])).toBe(pawn);
  }
  // And for final rank
  board.setBoard([new King(white, [7, 0]), new King(black, [0, 0]),
    new Pawn(white, [0, 5]), new Pawn(black, [7, 5])]);
  board.setTurn(white);
  expect(board.applyMove(new Move([0, 5], [-1, 5]))).toBeFalsy();
  expect(board.applyMove(new Move([7, 5], [8, 5]))).toBeFalsy();
});

test('accepted rook moves', () => {
  const board = new Board();
  const rook = new Rook(white, [5, 5]);
  board.setBoard([new King(white, [7, 0]), new King(black, [0, 0]), rook]);
  let moveTos = [[4, 5], [4, 4], [5, 4], [5, 5]];
  // Move once all four ways
  for (let i = 0; i < moveTos.length; i += 1) {
    board.setTurn(white);
    expect(board.applyMove(new Move(rook.getPosition(), moveTos[i]))).toBeTruthy();
    expect(board.getPiece(moveTos[i])).toBe(rook);
  }
  rook.setPosition([7, 7]);
  board.setBoard([new King(white, [3, 3]), new King(black, [5, 5]), rook]);
  moveTos = [[0, 7], [0, 0], [7, 0], [7, 7]];
  // Run the four corners
  for (let i = 0; i < moveTos.length; i += 1) {
    board.setTurn(white);
    expect(board.applyMove(new Move(rook.getPosition(), moveTos[i]))).toBeTruthy();
    expect(board.getPiece(moveTos[i])).toBe(rook);
  }
  rook.setPosition([7, 7]);
  const blackRook = new Rook(black, [0, 7]);
  board.setBoard([new King(white, [3, 3]), new King(black, [5, 5]), rook, blackRook]);
  // Capture rook
  board.setTurn(white);
  expect(board.applyMove(new Move(rook.getPosition(), blackRook.getPosition()))).toBeTruthy();
  expect(blackRook.isActive()).toBeFalsy();
});

test('rejected rook moves', () => {
  const board = new Board();
  const rook = new Rook(white, [5, 5]);
  board.setBoard([new King(white, [7, 0]), new King(black, [0, 0]), rook]);
  const moveTos = [[4, 4], [6, 6], [4, 6], [6, 4]];
  // Move to diagonals
  for (let i = 0; i < moveTos.length; i += 1) {
    board.setTurn(white);
    expect(board.applyMove(new Move(rook.getPosition(), moveTos[i]))).toBeFalsy();
    expect(board.getPiece([5, 5])).toBe(rook);
  }
  // Capture white rook
  const wRook = new Rook(white, [5, 6]);
  board.setTurn(white);
  board.setBoard([new King(white, [7, 0]), new King(black, [0, 0]), rook, wRook]);
  expect(board.applyMove(new Move(rook.getPosition(), wRook.getPosition()))).toBeFalsy();
  expect(wRook.isActive()).toBeTruthy();
  // Jump over black rook
  const bRook = new Rook(black, [5, 6]);
  board.setTurn(white);
  board.setBoard([new King(white, [7, 0]), new King(black, [0, 0]), rook, bRook]);
  expect(board.applyMove(new Move(rook.getPosition(), [5, 7]))).toBeFalsy();
  expect(bRook.isActive()).toBeTruthy();
  // Out of bounds
  rook.setPosition([7, 7]);
  board.setTurn(white);
  board.setBoard([new King(white, [7, 0]), new King(black, [0, 0]), rook]);
  expect(board.applyMove(new Move(rook.getPosition(), [8, 7]))).toBeFalsy();
  expect(board.applyMove(new Move(rook.getPosition(), [7, 8]))).toBeFalsy();
});

test('accepted bishop moves', () => {
  const board = new Board();
  const bishop = new Bishop(white, [5, 5]);
  board.setBoard([new King(white, [7, 5]), new King(black, [0, 5]), bishop]);
  let moveTos = [[4, 4], [5, 5], [4, 6], [5, 5]];
  // Move once all four ways
  for (let i = 0; i < moveTos.length; i += 1) {
    board.setTurn(white);
    expect(board.applyMove(new Move(bishop.getPosition(), moveTos[i]))).toBeTruthy();
    expect(board.getPiece(moveTos[i])).toBe(bishop);
  }
  bishop.setPosition([7, 7]);
  board.setBoard([new King(white, [0, 7]), new King(black, [5, 7]), bishop]);
  moveTos = [[0, 0], [7, 7]];
  // Run the four corners
  for (let i = 0; i < moveTos.length; i += 1) {
    board.setTurn(white);
    expect(board.applyMove(new Move(bishop.getPosition(), moveTos[i]))).toBeTruthy();
    expect(board.getPiece(moveTos[i])).toBe(bishop);
  }
  bishop.setPosition([0, 7]);
  board.setBoard([new King(white, [0, 0]), new King(black, [5, 7]), bishop]);
  moveTos = [[7, 0], [0, 7]];
  // Run the four corners
  for (let i = 0; i < moveTos.length; i += 1) {
    board.setTurn(white);
    expect(board.applyMove(new Move(bishop.getPosition(), moveTos[i]))).toBeTruthy();
    expect(board.getPiece(moveTos[i])).toBe(bishop);
  }
  bishop.setPosition([4, 4]);
  const blackBishop = new Bishop(black, [5, 5]);
  board.setBoard([new King(white, [3, 3]), new King(black, [5, 5]), bishop, blackBishop]);
  // Capture bishop
  board.setTurn(white);
  expect(board.applyMove(new Move(bishop.getPosition(), blackBishop.getPosition()))).toBeTruthy();
  expect(blackBishop.isActive()).toBeFalsy();
});

test('rejected bishop moves', () => {
  const board = new Board();
  const bishop = new Bishop(white, [5, 5]);
  board.setBoard([new King(white, [7, 0]), new King(black, [0, 5]), bishop]);
  const moveTos = [[5, 4], [4, 5], [5, 6], [6, 5]];
  // Move to horizontals
  for (let i = 0; i < moveTos.length; i += 1) {
    board.setTurn(white);
    expect(board.applyMove(new Move(bishop.getPosition(), moveTos[i]))).toBeFalsy();
    expect(board.getPiece([5, 5])).toBe(bishop);
  }
  // Capture white bishop
  const wBishop = new Bishop(white, [4, 4]);
  board.setTurn(white);
  board.setBoard([new King(white, [7, 0]), new King(black, [0, 0]), bishop, wBishop]);
  expect(board.applyMove(new Move(bishop.getPosition(), wBishop.getPosition()))).toBeFalsy();
  expect(wBishop.isActive()).toBeTruthy();
  // Jump over black bishop
  const bBishop = new Bishop(black, [6, 6]);
  board.setTurn(white);
  board.setBoard([new King(white, [7, 0]), new King(black, [0, 0]), bishop, bBishop]);
  expect(board.applyMove(new Move(bishop.getPosition(), [7, 7]))).toBeFalsy();
  expect(bBishop.isActive()).toBeTruthy();
  // Out of bounds
  bishop.setPosition([4, 7]);
  board.setTurn(white);
  board.setBoard([new King(white, [7, 7]), new King(black, [0, 7]), bishop]);
  expect(board.applyMove(new Move(bishop.getPosition(), [5, 8]))).toBeFalsy();
  expect(board.applyMove(new Move(bishop.getPosition(), [3, 8]))).toBeFalsy();
});

test('accepted knight moves', () => {
  const moveTos = [[2, 3], [2, 5], [6, 3], [6, 5], [3, 2], [3, 6], [5, 2], [5, 6]];
  // Test white
  for (let i = 0; i < moveTos.length; i += 1) {
    const board = new Board();
    const knight = new Knight(white, [4, 4]);
    board.setBoard([new King(white, [7, 0]), new King(black, [0, 0]), knight]);
    expect(board.applyMove(new Move(knight.getPosition(), moveTos[i]))).toBeTruthy();
  }
  // Test black
  for (let i = 0; i < moveTos.length; i += 1) {
    const board = new Board();
    const knight = new Knight(black, [4, 4]);
    board.setTurn(black);
    board.setBoard([new King(white, [7, 0]), new King(black, [0, 0]), knight]);
    expect(board.applyMove(new Move(knight.getPosition(), moveTos[i]))).toBeTruthy();
  }
  // Test capture
  for (let i = 0; i < moveTos.length; i += 1) {
    const board = new Board();
    const knight = new Knight(white, [4, 4]);
    const bKnight = new Knight(black, moveTos[i]);
    board.setBoard([new King(white, [7, 0]), new King(black, [0, 0]), knight, bKnight]);
    expect(board.applyMove(new Move(knight.getPosition(), moveTos[i]))).toBeTruthy();
    expect(bKnight.isActive()).toBeFalsy();
  }
});

test('rejected knight moves', () => {
  let moveTos = [[-1, -1], [3, 3], [3, 4], [3, 5], [4, 3], [4, 5], [5, 3], [5, 4], [5, 5]];
  // Test bad moves
  for (let i = 0; i < moveTos.length; i += 1) {
    const board = new Board();
    const knight = new Knight(white, [4, 4]);
    board.setBoard([knight, new King(white, [7, 0]), new King(black, [0, 0])]);
    expect(board.applyMove(new Move(knight.getPosition(), moveTos[i]))).toBeFalsy();
  }
  // Test invalid capture
  moveTos = [[2, 3], [2, 5], [6, 3], [6, 5], [3, 2], [3, 6], [5, 2], [5, 6]];
  for (let i = 0; i < moveTos.length; i += 1) {
    const board = new Board();
    const knight = new Knight(white, [4, 4]);
    const wKnight = new Knight(white, moveTos[i]);
    board.setBoard([new King(white, [7, 0]), new King(black, [0, 0]), knight, wKnight]);
    expect(board.applyMove(new Move(knight.getPosition(), moveTos[i]))).toBeFalsy();
    expect(wKnight.isActive()).toBeTruthy();
  }
});

test('accepted queen moves', () => {
  const moveTos = [[0, 0], [0, 4], [4, 7], [7, 7], [7, 4], [4, 0],
    [3, 3], [3, 4], [3, 5], [4, 3], [4, 5], [5, 3], [5, 4], [5, 5]];
  // Test all valid moves
  for (let i = 0; i < moveTos.length; i += 1) {
    const board = new Board();
    const queen = new Queen(white, [4, 4]);
    board.setBoard([new King(white, [2, 3]), new King(black, [6, 5]), queen]);
    expect(board.applyMove(new Move(queen.getPosition(), moveTos[i]))).toBeTruthy();
  }
  // Test capture
  for (let i = 0; i < moveTos.length; i += 1) {
    const board = new Board();
    const queen = new Queen(white, [4, 4]);
    const bQueen = new Queen(black, moveTos[i]);
    board.setBoard([new King(white, [2, 3]), new King(black, [6, 5]), queen, bQueen]);
    expect(board.applyMove(new Move(queen.getPosition(), moveTos[i]))).toBeTruthy();
    expect(bQueen.isActive()).toBeFalsy();
  }
});

test('rejected queen moves', () => {
  let moveTos = [[2, 3], [2, 5], [6, 3], [6, 5], [3, 2], [3, 6], [5, 2], [5, 6]];
  // Test invalid (knight) moves
  for (let i = 0; i < moveTos.length; i += 1) {
    const board = new Board();
    const queen = new Queen(white, [4, 4]);
    board.setBoard([new King(white, [2, 3]), new King(black, [6, 5]), queen]);
    expect(board.applyMove(new Move(queen.getPosition(), moveTos[i]))).toBeFalsy();
  }
  // Test jumping over opponents
  moveTos = [[0, 0], [0, 4], [0, 7], [4, 7], [7, 7], [7, 4], [7, 0], [4, 0]];
  for (let i = 0; i < moveTos.length; i += 1) {
    const board = new Board();
    const queen = new Queen(white, [4, 4]);
    board.setBoard([new King(white, [2, 3]), new King(black, [6, 5]), queen,
      new Pawn(black, [3, 3]), new Pawn(black, [3, 4]), new Pawn(black, [3, 5]),
      new Pawn(black, [4, 3]), new Pawn(black, [4, 5]), new Pawn(black, [5, 3]),
      new Pawn(black, [5, 4]), new Pawn(black, [5, 5])]);
    expect(board.applyMove(new Move(queen.getPosition(), moveTos[i]))).toBeFalsy();
  }
  // Test invalid capture
  for (let i = 0; i < moveTos.length; i += 1) {
    const board = new Board();
    const queen = new Queen(white, [4, 4]);
    const wQueen = new Queen(white, moveTos[i]);
    board.setBoard([new King(white, [2, 3]), new King(black, [6, 5]), queen, wQueen]);
    expect(board.applyMove(new Move(queen.getPosition(), moveTos[i]))).toBeFalsy();
    expect(wQueen.isActive()).toBeTruthy();
  }
});

test('accepted king moves', () => {
  const moveTos = [[3, 3], [3, 4], [3, 5], [4, 3], [4, 5], [5, 3], [5, 4], [5, 5]];
  // Test white
  for (let i = 0; i < moveTos.length; i += 1) {
    const board = new Board();
    const king = new King(white, [4, 4]);
    board.setBoard([king, new King(black, [0, 0])]);
    expect(board.applyMove(new Move(king.getPosition(), moveTos[i]))).toBeTruthy();
  }
  // Test black
  for (let i = 0; i < moveTos.length; i += 1) {
    const board = new Board();
    const king = new King(black, [4, 4]);
    board.setTurn(black);
    board.setBoard([king, new King(white, [0, 0])]);
    expect(board.applyMove(new Move(king.getPosition(), moveTos[i]))).toBeTruthy();
  }
  // Test capture
  for (let i = 0; i < moveTos.length; i += 1) {
    const board = new Board();
    const king = new King(white, [4, 4]);
    const bPawn = new Pawn(black, moveTos[i]);
    board.setBoard([new King(white, [7, 0]), king, bPawn]);
    expect(board.applyMove(new Move(king.getPosition(), moveTos[i]))).toBeTruthy();
    expect(bPawn.isActive()).toBeFalsy();
  }
});

test('rejected king moves', () => {
  let moveTos = [[-1, -1], [1, 4], [4, 1], [2, 3], [2, 5], [6, 3], [6, 5],
    [3, 2], [3, 6], [5, 2], [5, 6]];
  // Test bad moves
  for (let i = 0; i < moveTos.length; i += 1) {
    const board = new Board();
    const king = new King(white, [4, 4]);
    board.setBoard([king, new King(black, [0, 0])]);
    expect(board.applyMove(new Move(king.getPosition(), moveTos[i]))).toBeFalsy();
  }

  moveTos = [[3, 3], [3, 4], [3, 5], [4, 3], [4, 5], [5, 3], [5, 4], [5, 5]];
  // Test invalid capture
  for (let i = 0; i < moveTos.length; i += 1) {
    const board = new Board();
    const king = new King(white, [4, 4]);
    const wPawn = new Pawn(white, moveTos[i]);
    board.setBoard([new King(white, [7, 0]), king, wPawn]);
    expect(board.applyMove(new Move(king.getPosition(), moveTos[i]))).toBeFalsy();
    expect(wPawn.isActive()).toBeTruthy();
  }
});

test('detect check in move validation', () => {
  let board = new Board();
  board.setBoard([new King(white, [7, 5]),
    new Rook(white, [6, 5]),
    new Rook(black, [5, 5]),
    new King(black, [4, 5])]);
  // Do not allow moves that place player's king in check
  expect(board.applyMove(new Move([6, 5], [6, 4]))).toBeFalsy();
  board = new Board();
  board.setBoard([new King(white, [7, 5]),
    new Rook(black, [5, 5]),
    new King(black, [4, 5])]);
  // Force the king to move out of check
  board.setTurn(white);
  expect(board.applyMove(new Move([7, 5], [6, 5]))).toBeFalsy();
  expect(board.applyMove(new Move([7, 5], [7, 4]))).toBeTruthy();
  // Board with no white king
  board.setBoard([new King(black, [4, 5])]);
  board.setTurn(white);
  expect(board.isCheck()).toBeTruthy();
  expect(board.applyMove(new Move([0, 0], [0, 1]))).toBeFalsy();
});

test('detect checkmate', () => {
  const board = new Board();
  expect(board.isCheckmate()).toBeFalsy();
  // Fool's mate test
  // Move pawns
  expect(board.applyMove(new Move([6, 5], [5, 5]))).toBeTruthy();
  expect(board.applyMove(new Move([1, 4], [3, 4]))).toBeTruthy();
  expect(board.applyMove(new Move([6, 6], [4, 6]))).toBeTruthy();
  // Move black's queen into position
  expect(board.applyMove(new Move([0, 3], [4, 7]))).toBeTruthy();
  expect(board.isCheckmate()).toBeTruthy();
  expect(board.isStalemate()).toBeFalsy();
  // White is in check but not checkmate for next test
  board.setBoard([new King(white, [7, 5]),
    new Rook(black, [5, 5]),
    new King(black, [4, 5])]);
  board.setTurn(white);
  expect(board.isCheckmate()).toBeFalsy();
});

test('detect stalemate', () => {
  const board = new Board();
  expect(board.isStalemate()).toBeFalsy();
  // Stalemate test
  board.setBoard([new King(white, [0, 7]),
    new King(black, [1, 5]),
    new Queen(black, [2, 6])]);
  expect(board.isCheckmate()).toBeFalsy();
  expect(board.isStalemate()).toBeTruthy();
  // White is in check but not stalemate for next test
  board.setBoard([new King(white, [7, 5]),
    new Rook(black, [5, 5]),
    new King(black, [4, 5])]);
  expect(board.isStalemate()).toBeFalsy();
});

test('pawn promotion', () => {
  const board = new Board();
  // Test white pawn promote
  let pawn = new Pawn(white, [1, 7]);
  board.setBoard([new King(white, [7, 7]),
    new King(black, [0, 0]),
    pawn]);
  expect(board.isPromotion()).toBeFalsy();
  expect(board.applyPromotion(promoteQueen)).toBeFalsy();
  expect(board.applyMove(new Move([1, 7], [0, 7]))).toBeTruthy();
  expect(pawn.canPromote()).toBeTruthy();
  expect(board.isPromotion()).toBeTruthy();
  expect(board.applyPromotion('foobar')).toBeFalsy();
  expect(board.applyPromotion(promoteQueen)).toBeTruthy();
  expect(pawn.isActive()).toBeFalsy();
  let newPiece = board.getPiece([0, 7]);
  expect(newPiece).toBeInstanceOf(Queen);
  expect(newPiece.getColor()).toBe(white);
  pawn = new Pawn(white, [1, 7]);
  board.setBoard([new King(white, [7, 7]),
    new King(black, [0, 0]),
    pawn]);
  board.setTurn(white);
  expect(board.isPromotion()).toBeFalsy();
  expect(board.applyPromotion(promoteBishop)).toBeFalsy();
  expect(board.applyMove(new Move([1, 7], [0, 7]))).toBeTruthy();
  expect(pawn.canPromote()).toBeTruthy();
  expect(board.isPromotion()).toBeTruthy();
  expect(board.applyPromotion('foobar')).toBeFalsy();
  expect(board.applyPromotion(promoteBishop)).toBeTruthy();
  expect(pawn.isActive()).toBeFalsy();
  newPiece = board.getPiece([0, 7]);
  expect(newPiece).toBeInstanceOf(Bishop);
  expect(newPiece.getColor()).toBe(white);
  // Test black pawn promote
  pawn = new Pawn(black, [6, 0]);
  board.setBoard([new King(white, [7, 7]),
    new King(black, [0, 0]),
    pawn]);
  board.setTurn(black);
  expect(board.isPromotion()).toBeFalsy();
  expect(board.applyPromotion(promoteQueen)).toBeFalsy();
  expect(board.applyMove(new Move([6, 0], [7, 0]))).toBeTruthy();
  expect(pawn.canPromote()).toBeTruthy();
  expect(board.isPromotion()).toBeTruthy();
  expect(board.applyPromotion('foobar')).toBeFalsy();
  expect(board.applyPromotion(promoteKnight)).toBeTruthy();
  expect(pawn.isActive()).toBeFalsy();
  newPiece = board.getPiece([7, 0]);
  expect(newPiece).toBeInstanceOf(Knight);
  expect(newPiece.getColor()).toBe(black);
  pawn = new Pawn(black, [6, 0]);
  board.setBoard([new King(white, [7, 7]),
    new King(black, [0, 0]),
    pawn]);
  board.setTurn(black);
  expect(board.isPromotion()).toBeFalsy();
  expect(board.applyPromotion(promoteQueen)).toBeFalsy();
  expect(board.applyMove(new Move([6, 0], [7, 0]))).toBeTruthy();
  expect(pawn.canPromote()).toBeTruthy();
  expect(board.isPromotion()).toBeTruthy();
  expect(board.applyPromotion('foobar')).toBeFalsy();
  expect(board.applyPromotion(promoteRook)).toBeTruthy();
  expect(pawn.isActive()).toBeFalsy();
  newPiece = board.getPiece([7, 0]);
  expect(newPiece).toBeInstanceOf(Rook);
  expect(newPiece.getColor()).toBe(black);
});

test('initial pawn move', () => {
  const board = new Board();
  expect(board.applyMove(new Move([6, 0], [4, 0]))).toBeTruthy();
  expect(board.applyMove(new Move([1, 7], [3, 7]))).toBeTruthy();
  expect(board.applyMove(new Move([4, 0], [2, 0]))).toBeFalsy();
  expect(board.applyMove(new Move([3, 7], [5, 7]))).toBeFalsy();
});

test('en passant capture', () => {
  const board = new Board();
  // Right capture, black
  let passantPawn = new Pawn(white, [6, 3]);
  let capturingPawn = new Pawn(black, [4, 2]);
  board.setBoard([new King(white, [1, 7]),
    new King(black, [0, 0]),
    passantPawn,
    capturingPawn]);
  expect(board.applyMove(new Move([6, 3], [4, 3]))).toBeTruthy();
  expect(passantPawn.isEnPassant()).toBeTruthy();
  expect(board.applyMove(new Move([4, 2], [5, 3]))).toBeTruthy();
  expect(passantPawn.isActive()).toBeFalsy();
  expect(board.getPiece([4, 3])).toBeNull();
  // Left capture, white
  board.setTurn(black);
  passantPawn = new Pawn(black, [1, 3]);
  capturingPawn = new Pawn(white, [3, 4]);
  board.setBoard([new King(white, [1, 7]),
    new King(black, [0, 0]),
    passantPawn,
    capturingPawn]);
  expect(board.applyMove(new Move([1, 3], [3, 3]))).toBeTruthy();
  expect(passantPawn.isEnPassant()).toBeTruthy();
  expect(board.applyMove(new Move([3, 4], [2, 3]))).toBeTruthy();
  expect(passantPawn.isActive()).toBeFalsy();
  expect(board.getPiece([3, 3])).toBeNull();
  // Test en Passant to only last one turn
  board.setTurn(white);
  passantPawn = new Pawn(white, [6, 3]);
  capturingPawn = new Pawn(black, [4, 4]);
  board.setBoard([new King(white, [1, 7]),
    new King(black, [0, 0]),
    passantPawn,
    capturingPawn]);
  expect(board.applyMove(new Move([6, 3], [4, 3]))).toBeTruthy();
  expect(passantPawn.isEnPassant()).toBeTruthy();
  expect(board.applyMove(new Move([0, 0], [0, 1]))).toBeTruthy();
  expect(passantPawn.isEnPassant()).toBeFalsy();
  board.setTurn(black);
  expect(board.applyMove(new Move([4, 4], [5, 3]))).toBeFalsy();
});

test('castle left/right', () => {
  let board = new Board();
  board.setPiece([7, 1], null);
  board.setPiece([7, 2], null);
  board.setPiece([7, 3], null);
  board.setPiece([0, 1], null);
  board.setPiece([0, 2], null);
  board.setPiece([0, 3], null);
  // Castle left white
  expect(board.applyCastle(castleLeft)).toBeTruthy();
  // Castle left black
  expect(board.applyCastle(castleLeft)).toBeTruthy();
  // Check pieces
  expect(board.getPiece([7, 2])).toBeInstanceOf(King);
  expect(board.getPiece([7, 3])).toBeInstanceOf(Rook);
  expect(board.getPiece([0, 2])).toBeInstanceOf(King);
  expect(board.getPiece([0, 3])).toBeInstanceOf(Rook);

  // Reset board
  board = new Board();
  board.setPiece([7, 5], null);
  board.setPiece([7, 6], null);
  board.setPiece([0, 5], null);
  board.setPiece([0, 6], null);
  // Castle right white
  expect(board.applyCastle(castleRight)).toBeTruthy();
  // Castle right black
  expect(board.applyCastle(castleRight)).toBeTruthy();
  // Check pieces
  expect(board.getPiece([7, 6])).toBeInstanceOf(King);
  expect(board.getPiece([7, 5])).toBeInstanceOf(Rook);
  expect(board.getPiece([0, 6])).toBeInstanceOf(King);
  expect(board.getPiece([0, 5])).toBeInstanceOf(Rook);

  // Blocking pieces test
  board = new Board();
  expect(board.applyCastle(castleLeft)).toBeFalsy();
  expect(board.applyCastle(castleRight)).toBeFalsy();

  // Moved rook test
  board = new Board();
  board.setPiece([7, 1], null);
  board.setPiece([7, 2], null);
  board.setPiece([7, 3], null);
  board.setPiece([7, 5], null);
  board.setPiece([7, 6], null);
  expect(board.applyMove(new Move([7, 0], [7, 1]))).toBeTruthy();
  board.setTurn(white);
  expect(board.applyMove(new Move([7, 1], [7, 0]))).toBeTruthy();
  board.setTurn(white);
  expect(board.applyCastle(castleLeft)).toBeFalsy();

  // Moved king test
  board = new Board();
  board.setPiece([7, 1], null);
  board.setPiece([7, 2], null);
  board.setPiece([7, 3], null);
  expect(board.applyMove(new Move([7, 4], [7, 3]))).toBeTruthy();
  board.setTurn(white);
  expect(board.applyMove(new Move([7, 3], [7, 4]))).toBeTruthy();
  board.setTurn(white);
  expect(board.applyCastle(castleLeft)).toBeFalsy();

  // Invalid text test
  expect(board.applyCastle('foobar')).toBeFalsy();

  // King in check test
  board = new Board();
  board.setBoard([new King(white, [7, 4]),
    new Rook(white, [7, 0]),
    new King(black, [0, 7]),
    new Rook(black, [0, 4])]);
  expect(board.applyCastle(castleLeft)).toBeFalsy();

  // Pass through attacked square test
  board = new Board();
  board.setBoard([new King(white, [7, 4]),
    new Rook(white, [7, 0]),
    new King(black, [0, 7]),
    new Rook(black, [0, 3])]);
  expect(board.applyCastle(castleLeft)).toBeFalsy();
});

test('piece ADT does not have moves', () => {
  const piece = new Piece(white, [0, 0]);
  const board = new Board();
  expect(() => { piece.getMoves(board); }).toThrow(TypeError);
});

test('undo moves', () => {
  const board = new Board();
  // Free up white's bishop
  board.applyMove(new Move([6, 4], [5, 4]));
  // Free up black's bishop
  board.applyMove(new Move([1, 4], [2, 4]));
  // Save state of board
  const state1 = JSON.stringify(board.getBoard());
  // Move out white's bishop
  board.applyMove(new Move([7, 5], [2, 0]));
  // Capture the bishop with black's pawn
  board.applyMove(new Move([1, 1], [2, 0]));
  // Undo the bishop move
  expect(board.undo(2)).toBeTruthy();
  // Verify states are equal
  expect(JSON.stringify(board.getBoard())).toStrictEqual(state1);
  // Move the bishop out
  board.applyMove(new Move([7, 5], [5, 3]));
  // Move black's bishop out
  board.applyMove(new Move([0, 5], [2, 3]));
  // Move white's knight out
  board.applyMove(new Move([7, 6], [5, 7]));
  // Move black's knight out
  board.applyMove(new Move([0, 6], [2, 7]));
  // Castle right on white
  board.applyCastle(castleRight);
  // Save state
  const state2 = JSON.stringify(board.getBoard());
  // Castle right on black
  board.applyCastle(castleRight);
  // Undo the last move
  expect(board.undo(1)).toBeTruthy();
  expect(JSON.stringify(board.getBoard())).toStrictEqual(state2);
  // Do not undo 100 moves, would be errorneous
  expect(board.undo(100)).toBeFalsy();
  const board2 = new Board();
  // Move the pawn up and promote
  // White pawn up 2
  expect(board2.applyMove(new Move([6, 7], [4, 7]))).toBeTruthy();
  // Black pawn down 2
  expect(board2.applyMove(new Move([1, 6], [3, 6]))).toBeTruthy();
  // Capture left
  expect(board2.applyMove(new Move([4, 7], [3, 6]))).toBeTruthy();
  // Black knight down
  expect(board2.applyMove(new Move([0, 6], [2, 7]))).toBeTruthy();
  // Capture right
  expect(board2.applyMove(new Move([3, 6], [2, 7]))).toBeTruthy();
  // Black bishop down
  expect(board2.applyMove(new Move([0, 5], [1, 6]))).toBeTruthy();
  // Capture left
  expect(board2.applyMove(new Move([2, 7], [1, 6]))).toBeTruthy();
  // Stall
  expect(board2.applyMove(new Move([0, 1], [2, 0]))).toBeTruthy();
  // Capture right, promote
  expect(board2.applyMove(new Move([1, 6], [0, 7]))).toBeTruthy();
  expect(board2.applyPromotion(promoteKnight)).toBeTruthy();
  // Move the black knight
  const state3 = JSON.stringify(board2.getBoard());
  expect(board2.applyMove(new Move([2, 0], [0, 1]))).toBeTruthy();
  // Undo the last move
  expect(board2.undo(1)).toBeTruthy();
  expect(JSON.stringify(board2.getBoard())).toStrictEqual(state3);
});

test('get board representation', () => {
  const board = new Board();
  const rep = board.getRepresentation();
  expect(rep.length).toBe(8);
  for (let i = 0; i < 8; i += 1) {
    expect(rep[i].length).toBe(8);
  }
});

test('get valid moves', () => {
  const board = new Board();
  for (let i = 0; i < 8; i += 1) {
    expect(board.getValidMoves([1, i]).length).toBe(2);
  }
  for (let i = 0; i < 8; i += 1) {
    expect(board.getValidMoves([6, i]).length).toBe(2);
  }
  expect(board.getValidMoves([0, 1]).length).toBe(2);
  expect(board.getValidMoves([0, 6]).length).toBe(2);
  expect(board.getValidMoves([0, 0]).length).toBe(0);
  expect(board.getValidMoves([4, 4]).length).toBe(0);
});

test('SAN history', () => {
  // The famous Bobby Fischer game
  // See https://www.chess.com/games/view/75289
  const board = new Board();

  expect(board.applyMove(new Move([7, 6], [5, 5]))).toBeTruthy();
  expect(board.applyMove(new Move([0, 6], [2, 5]))).toBeTruthy();

  expect(board.applyMove(new Move([6, 2], [4, 2]))).toBeTruthy();
  expect(board.applyMove(new Move([1, 6], [2, 6]))).toBeTruthy();

  expect(board.applyMove(new Move([7, 1], [5, 2]))).toBeTruthy();
  expect(board.applyMove(new Move([0, 5], [1, 6]))).toBeTruthy();

  expect(board.applyMove(new Move([6, 3], [4, 3]))).toBeTruthy();
  expect(board.applyCastle(castleRight)).toBeTruthy();

  expect(board.applyMove(new Move([7, 2], [4, 5]))).toBeTruthy();
  expect(board.applyMove(new Move([1, 3], [3, 3]))).toBeTruthy();

  expect(board.applyMove(new Move([7, 3], [5, 1]))).toBeTruthy();
  expect(board.applyMove(new Move([3, 3], [4, 2]))).toBeTruthy();

  expect(board.applyMove(new Move([5, 1], [4, 2]))).toBeTruthy();
  expect(board.applyMove(new Move([1, 2], [2, 2]))).toBeTruthy();

  expect(board.applyMove(new Move([6, 4], [4, 4]))).toBeTruthy();
  expect(board.applyMove(new Move([0, 1], [1, 3]))).toBeTruthy();

  expect(board.applyMove(new Move([7, 0], [7, 3]))).toBeTruthy();
  expect(board.applyMove(new Move([1, 3], [2, 1]))).toBeTruthy();

  expect(board.applyMove(new Move([4, 2], [3, 2]))).toBeTruthy();
  expect(board.applyMove(new Move([0, 2], [4, 6]))).toBeTruthy();

  // 10 turns in

  expect(board.applyMove(new Move([4, 5], [3, 6]))).toBeTruthy();
  expect(board.applyMove(new Move([2, 1], [4, 0]))).toBeTruthy();

  expect(board.applyMove(new Move([3, 2], [5, 0]))).toBeTruthy();
  expect(board.applyMove(new Move([4, 0], [5, 2]))).toBeTruthy();

  expect(board.applyMove(new Move([6, 1], [5, 2]))).toBeTruthy();
  expect(board.applyMove(new Move([2, 5], [4, 4]))).toBeTruthy();

  expect(board.applyMove(new Move([3, 6], [1, 4]))).toBeTruthy();
  expect(board.applyMove(new Move([0, 3], [2, 1]))).toBeTruthy();

  expect(board.applyMove(new Move([7, 5], [4, 2]))).toBeTruthy();
  expect(board.applyMove(new Move([4, 4], [5, 2]))).toBeTruthy();

  expect(board.applyMove(new Move([1, 4], [3, 2]))).toBeTruthy();
  expect(board.applyMove(new Move([0, 5], [0, 4]))).toBeTruthy();

  expect(board.applyMove(new Move([7, 4], [7, 5]))).toBeTruthy();
  expect(board.applyMove(new Move([4, 6], [2, 4]))).toBeTruthy();

  expect(board.applyMove(new Move([3, 2], [2, 1]))).toBeTruthy();
  expect(board.applyMove(new Move([2, 4], [4, 2]))).toBeTruthy();

  expect(board.applyMove(new Move([7, 5], [7, 6]))).toBeTruthy();
  expect(board.applyMove(new Move([5, 2], [6, 4]))).toBeTruthy();

  expect(board.applyMove(new Move([7, 6], [7, 5]))).toBeTruthy();
  expect(board.applyMove(new Move([6, 4], [4, 3]))).toBeTruthy();

  // 20 turns in

  expect(board.applyMove(new Move([7, 5], [7, 6]))).toBeTruthy();
  expect(board.applyMove(new Move([4, 3], [6, 4]))).toBeTruthy();

  expect(board.applyMove(new Move([7, 6], [7, 5]))).toBeTruthy();
  expect(board.applyMove(new Move([6, 4], [5, 2]))).toBeTruthy();

  expect(board.applyMove(new Move([7, 5], [7, 6]))).toBeTruthy();
  expect(board.applyMove(new Move([1, 0], [2, 1]))).toBeTruthy();

  expect(board.applyMove(new Move([5, 0], [4, 1]))).toBeTruthy();
  expect(board.applyMove(new Move([0, 0], [4, 0]))).toBeTruthy();

  expect(board.applyMove(new Move([4, 1], [2, 1]))).toBeTruthy();
  expect(board.applyMove(new Move([5, 2], [7, 3]))).toBeTruthy();

  expect(board.applyMove(new Move([6, 7], [5, 7]))).toBeTruthy();
  expect(board.applyMove(new Move([4, 0], [6, 0]))).toBeTruthy();

  expect(board.applyMove(new Move([7, 6], [6, 7]))).toBeTruthy();
  expect(board.applyMove(new Move([7, 3], [6, 5]))).toBeTruthy();

  expect(board.applyMove(new Move([7, 7], [7, 4]))).toBeTruthy();
  expect(board.applyMove(new Move([0, 4], [7, 4]))).toBeTruthy();

  expect(board.applyMove(new Move([2, 1], [0, 3]))).toBeTruthy();
  expect(board.applyMove(new Move([1, 6], [0, 5]))).toBeTruthy();

  expect(board.applyMove(new Move([5, 5], [7, 4]))).toBeTruthy();
  expect(board.applyMove(new Move([4, 2], [3, 3]))).toBeTruthy();

  // 30 turns in

  expect(board.applyMove(new Move([7, 4], [5, 5]))).toBeTruthy();
  expect(board.applyMove(new Move([6, 5], [4, 4]))).toBeTruthy();

  expect(board.applyMove(new Move([0, 3], [0, 1]))).toBeTruthy();
  expect(board.applyMove(new Move([1, 1], [3, 1]))).toBeTruthy();

  expect(board.applyMove(new Move([5, 7], [4, 7]))).toBeTruthy();
  expect(board.applyMove(new Move([1, 7], [3, 7]))).toBeTruthy();

  expect(board.applyMove(new Move([5, 5], [3, 4]))).toBeTruthy();
  expect(board.applyMove(new Move([0, 6], [1, 6]))).toBeTruthy();

  expect(board.applyMove(new Move([6, 7], [7, 6]))).toBeTruthy();
  expect(board.applyMove(new Move([0, 5], [3, 2]))).toBeTruthy();

  expect(board.applyMove(new Move([7, 6], [7, 5]))).toBeTruthy();
  expect(board.applyMove(new Move([4, 4], [5, 6]))).toBeTruthy();

  expect(board.applyMove(new Move([7, 5], [7, 4]))).toBeTruthy();
  expect(board.applyMove(new Move([3, 2], [4, 1]))).toBeTruthy();

  expect(board.applyMove(new Move([7, 4], [7, 3]))).toBeTruthy();
  expect(board.applyMove(new Move([3, 3], [5, 1]))).toBeTruthy();

  expect(board.applyMove(new Move([7, 3], [7, 2]))).toBeTruthy();
  expect(board.applyMove(new Move([5, 6], [6, 4]))).toBeTruthy();

  expect(board.applyMove(new Move([7, 2], [7, 1]))).toBeTruthy();
  expect(board.applyMove(new Move([6, 4], [5, 2]))).toBeTruthy();

  // Final move
  expect(board.applyMove(new Move([7, 1], [7, 2]))).toBeTruthy();
  expect(board.applyMove(new Move([6, 0], [6, 2]))).toBeTruthy();

  // Okay, now to test the SAN move notation

  const expected = [
    'Nf3',
    'Nf6',
    'c4',
    'g6',
    'Nc3',
    'Bg7',
    'd4',
    '0-0',
    'Bf4',
    'd5',
    'Qb3',
    'dxc4',
    'Qxc4',
    'c6',
    'e4',
    'Nbd7',
    'Rd1',
    'Nb6',
    'Qc5',
    'Bg4',
    'Bg5',
    'Na4',
    'Qa3',
    'Nxc3',
    'bxc3',
    'Nxe4',
    'Bxe7',
    'Qb6',
    'Bc4',
    'Nxc3',
    'Bc5',
    'Rfe8+',
    'Kf1',
    'Be6',
    'Bxb6',
    'Bxc4+',
    'Kg1',
    'Ne2+',
    'Kf1',
    'Nxd4+',
    'Kg1',
    'Ne2+',
    'Kf1',
    'Nc3+',
    'Kg1',
    'axb6',
    'Qb4',
    'Ra4',
    'Qxb6',
    'Nxd1',
    'h3',
    'Rxa2',
    'Kh2',
    'Nxf2',
    'Re1',
    'Rxe1',
    'Qd8+',
    'Bf8',
    'Nxe1',
    'Bd5',
    'Nf3',
    'Ne4',
    'Qb8',
    'b5',
    'h4',
    'h5',
    'Ne5',
    'Kg7',
    'Kg1',
    'Bc5+',
    'Kf1',
    'Ng3+',
    'Ke1',
    'Bb4+',
    'Kd1',
    'Bb3+',
    'Kc1',
    'Ne2+',
    'Kb1',
    'Nc3+',
    'Kc1',
    'Rc2#',
  ];

  const actual = board.getSANHistory();

  for (let i = 0; i < expected.length; i += 1) {
    expect(actual[i]).toBe(expected[i]);
  }

  expect(expected.length).toBe(actual.length);

  const board2 = new Board();
  // Test a board where two pieces of same file move to square
  board2.setBoard([new King(white, [7, 0]), new King(black, [0, 0]),
    new Knight(white, [7, 7]), new Knight(white, [5, 7])]);
  expect(board2.applyMove(new Move([7, 7], [6, 5]))).toBeTruthy();
  expect(board2.getSANHistory()[0]).toBe('N1f2');

  // Test a board for promotion
  const terms = [promoteRook, promoteQueen, promoteBishop, promoteKnight];
  const exp = ['h8R+', 'h8Q+', 'h8B', 'h8N'];
  for (let i = 0; i < exp.length; i += 1) {
    const board3 = new Board();
    board3.setBoard([new King(white, [7, 0]), new King(black, [0, 0]),
      new Pawn(white, [1, 7])]);
    expect(board3.applyMove(new Move([1, 7], [0, 7]))).toBeTruthy();
    expect(board3.applyPromotion(terms[i])).toBeTruthy();
    expect(board3.getSANHistory()[0]).toBe(exp[i]);
  }

  // Ensure coverage hits setpromotion
  const m = new Move([0, 0], [0, 1]);
  m.setPromotion('foobar');
  expect(m.getPromotion()).toBe('foobar');

  // Ignore duplicate draws in undo
  const board4 = new Board();
  board4.applyDraw();
  board4.applyDraw();
  expect(board4.undo(1)).toBeTruthy();
  const hist = board4.getHistory();
  expect(hist.length).toBe(0);

  // Test a queenside castle
  const board5 = new Board();
  board5.setPiece([7, 1], null);
  board5.setPiece([7, 2], null);
  board5.setPiece([7, 3], null);
  // Castle left white
  expect(board5.applyCastle(castleLeft)).toBeTruthy();
  expect(board5.getSANHistory()[0]).toBe('0-0-0');
  // Left capture via en passant, white
  const board6 = new Board();
  board6.setTurn(black);
  const passantPawn = new Pawn(black, [1, 3]);
  const capturingPawn = new Pawn(white, [3, 4]);
  board6.setBoard([new King(white, [1, 7]),
    new King(black, [0, 0]),
    passantPawn,
    capturingPawn]);
  expect(board6.applyMove(new Move([1, 3], [3, 3]))).toBeTruthy();
  expect(passantPawn.isEnPassant()).toBeTruthy();
  expect(board6.applyMove(new Move([3, 4], [2, 3]))).toBeTruthy();
  const hist2 = board6.getSANHistory();
  expect(hist2[hist2.length - 1]).toBe('exd6 e.p.');
});

test('apply draw', () => {
  const board = new Board();
  expect(board.applyDraw()).toBeTruthy();
  expect(board.getSANHistory()[0]).toBe('(=)');
});

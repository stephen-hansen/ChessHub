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
});

test('rejected knight moves', () => {
});

test('accepted queen moves', () => {
});

test('rejected queen moves', () => {
});

test('accepted king moves', () => {
});

test('rejected king moves', () => {
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
  // Castle left white
  board.applyCastle(castleLeft);
  // Castle left black
  board.applyCastle(castleLeft);
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

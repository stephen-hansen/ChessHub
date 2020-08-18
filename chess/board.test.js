const { Board } = require('./board.js');
const { Pawn } = require('./pawn.js');
const { black, white } = require('./constants.js');

test('board initializes to default board layout', () => {
  const newBoard = new Board();
  for (let i = 0; i < 8; i += 1) {
    const piece = newBoard.getPiece(0, i);
    expect(piece.getColor()).toBe(black);
    expect(piece).toBeInstanceOf(Pawn);
  }
  for (let i = 0; i < 8; i += 1) {
    const piece = newBoard.getPiece(7, i);
    expect(piece.getColor()).toBe(white);
    expect(piece).toBeInstanceOf(Pawn);
  }
});

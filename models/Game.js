import Chess from 'chess.js';
import React from 'react';

export default class Game extends React.Component {
   constructor() {
      this.board = new Chess();
      this.players = [];
      this.turn = 'w';
   }

   addPlayer(p) {
      this.players.append(p);
   }

   move(m) {
      let success = this.board.move(m);
      if (success) {
         if (this.turn == 'w') {
            this.turn == 'b';
         } else {
            this.turn == 'w';
         }
         return true;
      } else {
         return false;
      }
   }

   render() {
      //TODO
   }
}

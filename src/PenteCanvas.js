import { AnimatedCanvas } from '../src/common/AnimatedCanvas.js';

import { Board } from '../src/Board.js';

const GameStateKey = 'penteGameState';

export class PenteCanvas extends AnimatedCanvas {

  board = Object.assign( new Board(), JSON.parse( localStorage.getItem( GameStateKey ) ) );

  constructor( canvas ) {
    super( 100, 100, canvas );

    document.addEventListener( 'click', ( e ) => {
      const col = Math.round( Board.Size * e.offsetX / this.scale );
      const row = Math.round( Board.Size * e.offsetY / this.scale );
    
      const move = this.board.getMove( col, row );
      if ( move ) {
        this.board.applyMove( move );
        this.boardUpdated();
      }
    } );
    
    const KeyBindings = {
      KeyU: _ => { this.board.undo(); boardUpdated(); },
      KeyC: _ => { this.board = new Board(); boardUpdated(); }
    };
    document.addEventListener( 'keydown', ( e ) => KeyBindings[ e.code ]?.() );    

    this.boardUpdated();
  }

  update = ( dt ) => {
    if ( !this.board.update( dt ) ) {
      this.stop();
    }
  }
  
  draw = ( ctx ) => {
    this.ctx.scale( 1 / Board.Size, 1 / Board.Size );
    this.ctx.lineWidth = Board.Size / this.scale;

    this.board.draw( ctx );
  }

  boardUpdated() {
    localStorage.setItem( GameStateKey, JSON.stringify( this.board ) );
    this.start();
  }
}






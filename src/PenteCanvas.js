import { AnimatedCanvas } from '../src/common/AnimatedCanvas.js';

import { Board } from '../src/Board.js';

const GameStateKey = 'penteGameState';

export class PenteCanvas extends AnimatedCanvas {

  board = Object.assign( new Board(), JSON.parse( localStorage.getItem( GameStateKey ) ) );

  readyForUserMove = false;

  constructor( canvas ) {
    super( 100, 100, canvas );

    this.board.onUIUpdate = () => this.onUIUpdate();
    this.board.onReady = () => this.onReady();

    document.addEventListener( 'pointerdown', ( e ) => {
      if ( this.board.victory ) {
        this.newGame();
      }
      else if ( this.readyForUserMove ) {
        const col = Math.round( Board.Size * e.offsetX / this.scale );
        const row = Math.round( Board.Size * e.offsetY / this.scale );
        
        const move = this.board.getMove( col, row );
        if ( move ) {
          this.readyForUserMove = false;
          this.board.applyMove( move );
          this.boardUpdated();
        }
      }
    } );
    
    const KeyBindings = {
      KeyU: _ => this.undo(),
      KeyC: _ => this.newGame(),
    };
    document.addEventListener( 'keydown', ( e ) => KeyBindings[ e.code ]?.() );    

    this.boardUpdated();
  }

  update = ( dt ) => {
    // if ( !this.board.update( dt ) ) {
    //   this.stop();
    // }
    this.board.update( dt );
  }
  
  draw = ( ctx ) => {
    this.ctx.scale( 1 / Board.Size, 1 / Board.Size );
    this.ctx.lineWidth = Board.Size / this.scale;

    this.board.draw( ctx );
  }

  newGame() {
    this.board = new Board();
    this.board.ai = [ 0, 1, 1 ];
    this.board.onUIUpdate = () => this.onUIUpdate();
    this.board.onReady = () => this.onReady();
    this.boardUpdated();
  }

  undo() {
    this.board.undo();
    this.boardUpdated();
  }

  boardUpdated() {
    localStorage.setItem( GameStateKey, JSON.stringify( this.board ) );
    // this.onUIUpdate( this.board );
    this.start();
  }

  onReady() {
    this.stop();
    this.readyForUserMove = true;
    this.onUIUpdate( this.board );
  }

  // Override from UI
  onUIUpdate( board ) {}
}






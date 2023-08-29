import { Piece } from './Piece.js';

const NumTeams = 2;

const BoardSize = 18;
const BoardColor = '#ffb';
const DiamondSpacing = 6;
const DiamondSize = 0.15;

const grid = new Path2D();
for ( let i = 0; i <= BoardSize; i ++ ) {
  grid.moveTo( 0, i );
  grid.lineTo( BoardSize, i );

  grid.moveTo( i, 0 );
  grid.lineTo( i, BoardSize );
}

const thickGrid = new Path2D();
for ( let i = 0; i <= BoardSize; i += BoardSize / 2 ) {
  thickGrid.moveTo( 0, i );
  thickGrid.lineTo( BoardSize, i );

  thickGrid.moveTo( i, 0 );
  thickGrid.lineTo( i, BoardSize );
}

const diamonds = new Path2D();
for ( let row = 3; row < BoardSize; row += DiamondSpacing ) {
  for ( let col = 3; col < BoardSize; col += DiamondSpacing ) {
    addDiamond( col, row );
  }
}

for ( let row = 6; row < BoardSize; row += DiamondSpacing ) {
  for ( let col = 6; col < BoardSize; col += DiamondSpacing ) {
    addDiamond( col, row );
  }
}

function addDiamond( col, row ) {
  diamonds.moveTo( col, row - DiamondSize );
  diamonds.lineTo( col - DiamondSize, row );
  diamonds.lineTo( col, row + DiamondSize );
  diamonds.lineTo( col + DiamondSize, row );
  diamonds.closePath();
}

function inBounds( col, row ) {
  // TODO: Should the very edges be valid?
  return 0 < col && col < BoardSize &&
         0 < row && row < BoardSize;
}

export class Board {
  static Size = BoardSize;

  board = [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 1, 0, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 1, 1, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 2, 2, 2, 2, 2, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 2, 0, 2, 0, 2, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 2, 0, 0, 0, 2, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 0, 1, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 1, 0, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 2, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 2, 2, 2, 2, 2, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 2, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 2, 1, 0, 1, 0, 0, 0, 1, 0, 1, 2, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  ];

  currentTeam = 1;

  #pieces = Array.from( 
    Array( BoardSize + 1 ), () => Array.from( 
      Array( BoardSize + 1 ), () => new Piece( 0 ) 
    ) 
  );

  getMove( col, row ) {
    if ( inBounds( col, row ) && this.board[ col ][ row ] == 0 ) {
      const move = {
        add: { col: col, row: row, team: this.currentTeam },
        captures: [],
      }

      for ( let dRow = -1; dRow <= 1; dRow ++ ) {
        for ( let dCol = -1; dCol <= 1; dCol ++ ) {
          if ( ( dCol != 0 || dRow != 0 ) && 
               inBounds( col + dCol * 3, row + dRow * 3 ) ) {
            const cols  = [ 1, 2, 3 ].map( i => col + dCol * i );
            const rows  = [ 1, 2, 3 ].map( i => row + dRow * i );
            const teams = [ 0, 1, 2 ].map( i => this.board[ cols[ i ] ][ rows[ i ] ] );
              
            if ( teams[ 0 ] == teams[ 1 ] && 
                 teams[ 0 ] > 0 && teams[ 0 ] != this.currentTeam &&
                 teams[ 2 ] == this.currentTeam ) {
              move.captures.push( ...[ 0, 1 ].map( i => 
                ( { col: cols[ i ], row: rows[ i ], team: teams[ i ] } ) 
              ) );
            }
          }
        }
      }

      return move;
    }
  }

  applyMove( move ) {
    this.board[ move.add.col ][ move.add.row ] = move.add.team;
    move.captures.forEach( piece => this.board[ piece.col ][ piece.row ] = 0 );

    this.currentTeam = this.currentTeam % NumTeams + 1;   // TODO: Handle >2 teams?
  }

  undoMove( move ) {
    move.captures.forEach( piece => this.board[ piece.col ][ piece.row ] = piece.team );
    this.board[ move.add.col ][ move.add.row ] = 0;
  
    this.currentTeam = this.currentTeam % NumTeams + 1;   // TODO: Handle >2 teams?
  }

  update( dt ) {
    let changed = false;

    // Animate grows first
    for ( let row = 0; row <= BoardSize; row ++ ) {
      for ( let col = 0; col <= BoardSize; col ++ ) {
        const team = this.board[ col ][ row ];
        const piece = this.#pieces[ col ][ row ];

        if ( team > 0 ) {
          piece.team = team;
          changed |= piece.grow( dt );
        }
      }
    }

    // If no more grows, animate shrinks
    if ( !changed ) {
      for ( let row = 0; row <= BoardSize; row ++ ) {
        for ( let col = 0; col <= BoardSize; col ++ ) {
          const team = this.board[ col ][ row ];
          const piece = this.#pieces[ col ][ row ];
          
          if ( team == 0 ) {
            changed |= piece.shrink( dt );
          }
        }
      }
    }

    return changed;
  }

  draw( ctx, scale ) {
    // Board
    ctx.fillStyle = BoardColor;
    ctx.fillRect( 0, 0, 18, 18 );
  
    ctx.lineWidth = 2 / scale;
    ctx.strokeStyle = 'black';
    ctx.stroke( thickGrid );
  
    ctx.lineWidth = 1 / scale;
    ctx.stroke( grid );
  
    ctx.fillStyle = 'cyan';
    ctx.fill( diamonds );
    ctx.stroke( diamonds );

    // Pieces
    for ( let row = 0; row <= BoardSize; row ++ ) {
      ctx.save();

      for ( let col = 0; col <= BoardSize; col ++ ) {
        this.#pieces[ col ][ row ].draw( ctx );

        ctx.translate( 1, 0 );
      }

      ctx.restore();
      
      ctx.translate( 0, 1 );
    }
  }
}
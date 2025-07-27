function pawn(row, column, board) {
  const attacks = [];
  const piece = board[row][column];

  if (piece === 1) {
    if (row > 0 && column > 0) attacks.push([row - 1, column - 1]);
    if (row > 0 && column < 7) attacks.push([row - 1, column + 1]);
  } else if (piece === -1) {
    if (row < 7 && column > 0) attacks.push([row + 1, column - 1]);
    if (row < 7 && column < 7) attacks.push([row + 1, column + 1]);
  }

  return attacks;
}

export function enPassant(row, column, board, val) {
  const sign = Math.sign(val);  // Use the actual moving piece value
  let additionalMove = [];

  if (sign === -1) {
    if (row === 3) {
      if (column + 1 <= 7 && board[row][column + 1] === 1) {
        additionalMove.push([row -1, column]);
      }
      if (column - 1 >= 0 && board[row][column - 1] === 1) {
        additionalMove.push([row - 1, column]);
      }
    }
  }

  if (sign === 1) {
    if (row === 4) {
      if (column + 1 <= 7 && board[row][column + 1] === -1) {
        additionalMove.push([row + 1, column]);
      }
      if (column - 1 >= 0 && board[row][column - 1] === -1) {
        additionalMove.push([row + 1, column]);
      }
    }
  }

  return additionalMove;
}

export function castleKingSide(board,row,val)
{

    if(board[row][5] != 0 || board[row][6] != 0) { return;}

    for(let column = 5; column <= 6; column++)
    {
        board[row][4] = 0;
        board[row][column] = val;

        if(check(board,-1 *val)) {
            board[row][column] = 0;
            board[row][4] = val; 
            return; 
        }

        board[row][column] = 0;
        board[row][4] = val;
    }

    return [[row,6],[row,5]];
}

export function castleQueenSide(board,row,val)
{
    if(board[row][2] != 0 || board[row][3] != 0) return;

    for(let column = 3; column >= 2; column--)
    {
        board[row][column] = val;
        board[row][4] = 0

        if(check(board,-1 *val)){board[row][column] = 0; board[row][4] = val; return;}

        board[row][column] = 0;
        board[row][4] = val;
    }
    return [[row,2],[row,3]];
}

export function castling(board, val, wK, bK, wR1, wR2, bR1, bR2) {
  if (Math.abs(val) != 6) return;
  if (val == 6 && wK != 0) return;
  if (val == -6 && bK != 0) return;
  
  let returnVal = [];

  if (val === 6 && wK === 0) {
    if (wR1 === 0) {
      const q = castleQueenSide(board, 7, val);
      if (q) returnVal.push(q);
    }
    if (wR2 === 0) {
      const k = castleKingSide(board, 7, val);
      if (k) returnVal.push(k);
    }
  }

  else if (val === -6 && bK === 0) { 
    if (bR1 === 0) {
      const q = castleQueenSide(board, 0, val);
      if (q) returnVal.push(q);
    }
    if (bR2 === 0) {
      const k = castleKingSide(board, 0, val);
      if (k) returnVal.push(k);
    }
  }

  return returnVal;
}


function findPieces(board, pieceValue) {
  const positions = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === pieceValue) {
        positions.push([r, c]);
      }
    }
  }
  return positions;
}

export function undercheck(row, column, board, value) {
  const sign = Math.sign(value);
  const moves = caller(row, column, board, value);
  let validMoves = [];
  for(const move of moves)
  {
    const val = board[move[0]][move[1]] ;
    board[move[0]][move[1]] = value;
    board[row][column] = 0;

    if(!check(board, -sign)) validMoves.push(move);
    board[row][column] = value;
    board[move[0]][move[1]] = val;
  }
  return validMoves;
}


export function mymoves(board, value) {
    let sign = Math.sign(value);

    const validMoves = [];
    const allmyMoves = [];

    const kingPos = findPieces(board, 6 * sign);
    const queenPos = findPieces(board, 5 * sign);
    const rookPos = findPieces(board, 4 * sign);
    const bishopPos = findPieces(board, 3 * sign);
    const knightPos = findPieces(board, 2 * sign);
    const pawnPos = findPieces(board, 1 * sign);

    for (const [r, c] of kingPos) allmyMoves.push(...caller(r, c, board, 6 * sign));
    for (const [r, c] of queenPos) allmyMoves.push(...queenMovement(r, c, board));
    for (const [r, c] of rookPos) allmyMoves.push(...rookMovement(r, c, board));
    for (const [r, c] of bishopPos) allmyMoves.push(...bishopMovement(r, c, board));
    for (const [r, c] of knightPos) allmyMoves.push(...horseMovement(r, c, board));
    for (const [r, c] of pawnPos) allmyMoves.push(...pawn(r, c, board));

    return allmyMoves;
}

export function check(board,value){
    const sign = Math.sign(value);
    const enemy = -sign;
    const moves = mymoves(board, value);

    const kingPos = findPieces(board, 6 * enemy);
    console.log('kingpos', kingPos)
    for(const [r,c] of moves)
    {
        if(kingPos[0][0] === r && kingPos[0][1] === c) return true;
    }
    return false;
}

export function filterSafeMoves(row, column, board, value, moveFunction) {
  const moves = moveFunction(row, column, board);
  const sign = Math.sign(value);
  const validMoves = [];

  for (const [newR, newC] of moves) {
    const original = board[newR][newC];
    board[newR][newC] = value;
    board[row][column] = 0;

    if (!check(board, -sign)) validMoves.push([newR, newC]);

    board[row][column] = value;
    board[newR][newC] = original;
  }

  return validMoves;
}


export function caller(row, column, board, value) {
  if (value === 0) return;

  if (Math.abs(value) === 1) return filterSafeMoves(row, column, board, value, pawnMovement);
  if (Math.abs(value) === 2) return filterSafeMoves(row, column, board, value, horseMovement);
  if (Math.abs(value) === 3) return filterSafeMoves(row, column, board, value, bishopMovement);
  if (Math.abs(value) === 4) return filterSafeMoves(row, column, board, value, rookMovement);
  if (Math.abs(value) === 5) return filterSafeMoves(row, column, board, value, queenMovement);

  if (Math.abs(value) === 6) {
    let sign = Math.sign(value);

    const kingMoves = kingMovement(row, column, board);
    const validMoves = [];
    const allEnemyMoves = [];

    const kingPos = findPieces(board, 6 * -sign);
    const queenPos = findPieces(board, 5 * -sign);
    const rookPos = findPieces(board, 4 * -sign);
    const bishopPos = findPieces(board, 3 * -sign);
    const knightPos = findPieces(board, 2 * -sign);
    const pawnPos = findPieces(board, 1 * -sign);


    for (const move of kingMoves) {
      const [newR, newC] = move;
      const original = board[newR][newC];
      board[newR][newC] = value;
      board[row][column] = 0;

        for (const [r, c] of kingPos) allEnemyMoves.push(...kingMovement(r, c, board));
        for (const [r, c] of queenPos) allEnemyMoves.push(...queenMovement(r, c, board));
        for (const [r, c] of rookPos) allEnemyMoves.push(...rookMovement(r, c, board));
        for (const [r, c] of bishopPos) allEnemyMoves.push(...bishopMovement(r, c, board));
        for (const [r, c] of knightPos) allEnemyMoves.push(...horseMovement(r, c, board));
        for (const [r, c] of pawnPos) allEnemyMoves.push(...pawn(r, c, board));

      const isUnderAttack = allEnemyMoves.some(([er, ec]) => er === newR && ec === newC);
      if (!isUnderAttack) validMoves.push(move);

      board[row][column] = value;
      board[newR][newC] = original;
    }

    return validMoves;
  }
}

export function generalMovement(row, column, board, directions) {
    const sign = Math.sign(board[row][column]);
    let validMoves = [];

    for (const direction of directions) {
        let dummy_row = row + direction[0];
        let dummy_col = column + direction[1];
        while (dummy_row >= 0 && dummy_row < 8 && dummy_col >= 0 && dummy_col < 8) {
            if (board[dummy_row][dummy_col] == 0) {
                validMoves.push([dummy_row, dummy_col]);
            } else if (Math.sign(board[dummy_row][dummy_col]) !== sign) {
                validMoves.push([dummy_row, dummy_col]);
                break;
            } else {
                break;
            }
            dummy_row += direction[0];
            dummy_col += direction[1];
        }
    }
    return validMoves;
}

export function horseMovement(row, column, board) {
    const sign = Math.sign(board[row][column]);
    const possibleMoves = [
        [row + 2, column + 1], [row + 2, column - 1],
        [row - 2, column + 1], [row - 2, column - 1],
        [row + 1, column + 2], [row + 1, column - 2],
        [row - 1, column + 2], [row - 1, column - 2]
    ];

    let validMoves = [];
    for (const moves of possibleMoves) {
        if (moves[0] >= 0 && moves[0] < 8 && moves[1] >= 0 && moves[1] < 8) {
            if (Math.sign(board[moves[0]][moves[1]]) !== sign) {
                validMoves.push(moves);
            }
        }
    }
    return validMoves;
}

export function bishopMovement(row, column, board) {
    const directions = [[1, -1], [-1, 1], [1, 1], [-1, -1]];
    return generalMovement(row, column, board, directions);
}

export function rookMovement(row, column, board) {
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    return generalMovement(row, column, board, directions);
}

export function queenMovement(row, column, board) {
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1], [1, 1], [-1, -1]];
    return generalMovement(row, column, board, directions);
}

export function pawnMovement(row, column, board, allmoves = []) {
    const sign = Math.sign(board[row][column]);
    let validMoves = [];

    if (sign === -1) {
        const r1 = row + 1;
        const r2 = row + 2;

        if (row === 1 && board[r1][column] === 0 && board[r2][column] === 0) {
            validMoves.push([r1, column], [r2, column]);
        } else if (r1 < 8 && board[r1][column] === 0) {
            validMoves.push([r1, column]);
        }

        if (column > 0 && r1 < 8 && Math.sign(board[r1][column - 1]) === 1) {
            validMoves.push([r1, column - 1]);
        }
        if (column < 7 && r1 < 8 && Math.sign(board[r1][column + 1]) === 1) {
            validMoves.push([r1, column + 1]);
        }

    } else if (sign === 1) {
        const r1 = row - 1;
        const r2 = row - 2;

        if (row === 6 && board[r1][column] === 0 && board[r2][column] === 0) {
            validMoves.push([r1, column], [r2, column]);
        } else if (r1 >= 0 && board[r1][column] === 0) {
            validMoves.push([r1, column]);
        }

        if (column > 0 && r1 >= 0 && Math.sign(board[r1][column - 1]) === -1) {
            validMoves.push([r1, column - 1]);
        }
        if (column < 7 && r1 >= 0 && Math.sign(board[r1][column + 1]) === -1) {
            validMoves.push([r1, column + 1]);
        }
    }

    return validMoves;
}

export function kingMovement(row, column, board, black_pieces, white_pieces) {
    const sign = Math.sign(board[row][column]);
    const possibleMoves = [
        [row + 1, column], [row - 1, column],
        [row, column + 1], [row, column - 1],
        [row + 1, column + 1], [row - 1, column - 1],
        [row + 1, column - 1], [row - 1, column + 1]
    ];

    let validMoves = [];
    for (const moves of possibleMoves) {
        if (moves[0] >= 0 && moves[0] < 8 && moves[1] >= 0 && moves[1] < 8) {
            if (Math.sign(board[moves[0]][moves[1]]) !== sign) {
                validMoves.push(moves);
            }
        }
    }
    return validMoves;
}

export function checkmate(board, value) {
  const sign = Math.sign(value);
  const kingPos = findPieces(board, 6 * sign);
  if (!kingPos || kingPos.length === 0) return false;

  const [row, column] = kingPos[0];

  const kingMoves = caller(row, column, board, 6 * sign);
  if (kingMoves && kingMoves.length > 0) return false;

  const pieceTypes = [1, 2, 3, 4, 5];
    for (let i = 0; i < 5; i++) {
        const type = pieceTypes[i];
        const positions = findPieces(board, type * sign);

        for (const [fromR, fromC] of positions) {
            const moves = undercheck(fromR, fromC, board, board[fromR][fromC]);
            if (moves && moves.length > 0) return false;
        }
    }
  return true;
}

export function staleMate(board, value) {
  const sign = Math.sign(value);
  const kingPos = findPieces(board, 6 * sign);
  if (!kingPos || kingPos.length === 0) return false;

  const [kRow, kCol] = kingPos[0];
  const kingMoves = caller(kRow, kCol, board, 6 * sign);
  if (kingMoves && kingMoves.length > 0) return false;

  const pieceTypes = [1, 2, 3, 4, 5];
  for (let i = 0; i < pieceTypes.length; i++) {
    const type = pieceTypes[i];
    const positions = findPieces(board, type * sign);

    for (const [r, c] of positions) {
      const legalMoves = caller(r, c, board, board[r][c]);
      if (legalMoves && legalMoves.length > 0) return false;
    }
  } 
  return true;
}
import  {generalMovement , horseMovement , bishopMovement , kingMovement , queenMovement , rookMovement , pawnMovement, caller, mymoves, undercheck, filterSafeMoves,castling, castleKingSide, castleQueenSide,enPassant,checkmate,staleMate, check} from './movement.js'

export function FilterSafeMoves(row, column, board, value, moveFunction) {
  const moves = moveFunction(row, column, board);
  const sign = Math.sign(value);
  const validMoves = [];

  for (const [newR, newC] of moves) {
    const original = board[newR][newC];
    board[newR][newC] = value;
    board[row][column] = 0;

    if (!ifCheck(board, sign)) validMoves.push([newR, newC]);

    board[row][column] = value;
    board[newR][newC] = original;
  }

  return validMoves;
}

export function underCheck(row, column, board, value) {
  const sign = Math.sign(value);
  const moves = Caller(row, column, board, value);
  let validMoves = [];
  for(const move of moves)
  {
    const val = board[move[0]][move[1]] ;
    board[move[0]][move[1]] = value;
    board[row][column] = 0;

    if(!ifCheck(board, sign)) validMoves.push(move);
    board[row][column] = value;
    board[move[0]][move[1]] = val;
  }
  return validMoves;
}

export function Caller(row, column, board, value) {
  if (value === 0) return [];

  const pieceType = Math.abs(value);
  let moveFunction;

  switch (pieceType) {
    case 1: moveFunction = pawnMovement; break;
    case 2: moveFunction = horseMovement; break;
    case 3: moveFunction = bishopMovement; break;
    case 4: moveFunction = rookMovement; break;
    case 5: moveFunction = queenMovement; break;
    case 6: moveFunction = kingMovement; break;
    default: return [];
  }
  
  return FilterSafeMoves(row, column, board, value, moveFunction);
}

function ifCheck(board, color)
{
  const sign = Math.sign(color);
  const enemy = -1 * sign;

  let myKing = [];
  for(let row = 0; row < 8; row++)
  {
    if(myKing.length > 0) break;
    for(let column = 0; column < 8; column++)
    {
      if(board[row][column] === 6 * sign){
        myKing = [row,column];
        break;
      }
    }
  }

  const enemyMoves = mymoves(board, enemy);

  for(const move of enemyMoves){
    if(move[0] === myKing[0] && move[1] === myKing[1]) return true;
  }
  return false;

}


let passantMoves = null;

const PIECE_VALUES = {
  "1": 100, "2": 320, "3": 330, "4": 500, "5": 900, "6": 2000,
  "-1": -100, "-2": -320, "-3": -330, "-4": -500, "-5": -900, "-6": -2000,
};

const PAWN_W_PST = [
  [ 0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [ 5,  5, 10, 25, 25, 10,  5,  5],
  [ 0,  0,  0, 20, 20,  0,  0,  0],
  [ 5, -5,-10,  0,  0,-10, -5,  5],
  [ 5, 10, 10,-20,-20, 10, 10,  5],
  [ 0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_W_PST = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50],
];

const BISHOP_W_PST = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10,  5,  5, 10, 10,  5,  5,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10],
  [-10,  5,  0,  0,  0,  0,  5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20],
];

const ROOK_W_PST = [
  [ 0, 0, 0, 0, 0, 0, 0, 0],
  [ 5,10,10,10,10,10,10, 5],
  [-5, 0, 0, 0, 0, 0, 0,-5],
  [-5, 0, 0, 0, 0, 0, 0,-5],
  [-5, 0, 0, 0, 0, 0, 0,-5],
  [-5, 0, 0, 0, 0, 0, 0,-5],
  [-5, 0, 0, 0, 0, 0, 0,-5],
  [ 0, 0, 5,10,10, 5, 0, 0],
];

const QUEEN_W_PST = [
  [-20,-10,-10, -5, -5,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5,  5,  5,  5,  0,-10],
  [ -5,  0,  5,  5,  5,  5,  0, -5],
  [  0,  0,  5,  5,  5,  5,  0, -5],
  [-10,  5,  5,  5,  5,  5,  0,-10],
  [-10,  0,  5,  0,  0,  0,  0,-10],
  [-20,-10,-10, -5, -5,-10,-10,-20],
];

const KING_W_PST = [
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],
  [-10,-20,-20,-20,-20,-20,-20,-10],
  [ 20, 20,  0,  0,  0,  0, 20, 20],
  [ 30, 30, 10,  0,  0, 10, 30, 30],
  [ 20, 30, 10,  0,  0, 10, 30, 20],
];

const PAWN_B_PST = [], KNIGHT_B_PST = [], BISHOP_B_PST = [], ROOK_B_PST = [], QUEEN_B_PST = [], KING_B_PST = [];


for (let i = 0; i < 8; i++) {
  PAWN_B_PST[i]   = [...PAWN_W_PST[7 - i]];
  KNIGHT_B_PST[i] = [...KNIGHT_W_PST[7 - i]];
  BISHOP_B_PST[i] = [...BISHOP_W_PST[7 - i]];
  ROOK_B_PST[i]   = [...ROOK_W_PST[7 - i]];
  QUEEN_B_PST[i]  = [...QUEEN_W_PST[7 - i]];
  KING_B_PST[i]   = [...KING_W_PST[7 - i]];
}

function generateMoves(r, c, board, val, passantSquare) {
  let moves = [];
  const sign = Math.sign(val);

  if (ifCheck(board, sign)) {
    moves = underCheck(r, c, board, val) || [];
  } else {
    moves = Caller(r, c, board, val) || [];
  }

  if (passantSquare && Math.abs(val) === 1) {
    const [pr, pc] = passantSquare;
    if (r === pr - sign && (c === pc - 1 || c === pc + 1)) {
      const capturedPawnPos = [pr - sign, pc];
      const capturedPawnVal = board[capturedPawnPos[0]][capturedPawnPos[1]];

      board[pr][pc] = val;
      board[r][c] = 0;
      board[capturedPawnPos[0]][capturedPawnPos[1]] = 0;

      if (!ifCheck(board, sign)) {
        moves.push([pr, pc]);
      }

      board[r][c] = val;
      board[pr][pc] = 0;
      board[capturedPawnPos[0]][capturedPawnPos[1]] = capturedPawnVal;
    }
  }
  return moves;
}


export function Eval(board) {
  let evaluation = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece === 0) continue;

      evaluation += PIECE_VALUES[String(piece)];

      if (piece === 1) evaluation += PAWN_W_PST[r][c];
      else if (piece === 2) evaluation += KNIGHT_W_PST[r][c];
      else if (piece === 3) evaluation += BISHOP_W_PST[r][c];
      else if (piece === 4) evaluation += ROOK_W_PST[r][c];
      else if (piece === 5) evaluation += QUEEN_W_PST[r][c];
      else if (piece === 6) evaluation += KING_W_PST[r][c];

      else if (piece === -1) evaluation += PAWN_B_PST[r][c];
      else if (piece === -2) evaluation += KNIGHT_B_PST[r][c];
      else if (piece === -3) evaluation += BISHOP_B_PST[r][c];
      else if (piece === -4) evaluation += ROOK_B_PST[r][c];
      else if (piece === -5) evaluation += QUEEN_B_PST[r][c];
      else if (piece === -6) evaluation += KING_B_PST[r][c];
    }
  }

  return evaluation;
}

function minimax(board, depth, turn, alpha, beta, passantSquare) {
  const isWhite = turn === 1;
  let bestMove = null;

  const isCheckmate = checkmate(board, isWhite ? 1 : -1);
  const isStalemate = staleMate(board, isWhite ? 1 : -1);

  if (depth === 0 || isCheckmate || isStalemate) {
    if (isCheckmate) return [isWhite ? -10000 : 10000, null];
    if (isStalemate) return [0, null];
    return [Eval(board), null];
  }

  if (isWhite) {
    let maxEval = -10000;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const val = board[r][c];
        if (val <= 0) continue;

        const moves = generateMoves(r, c, board, val, passantSquare);
        if (!moves || moves.length === 0) continue;

        for (let [nr, nc] of moves) {
          const temp = board[nr][nc];
          let newPassantSquare = null;
          let capturedPawn = 0;

          const isEnPassant = passantSquare && val === 1 && nr === passantSquare[0] && nc === passantSquare[1];
          
          board[r][c] = 0;
          if (isEnPassant) {
            const capturedPawnPos = [nr + 1, nc];
            capturedPawn = board[capturedPawnPos[0]][capturedPawnPos[1]];
            board[capturedPawnPos[0]][capturedPawnPos[1]] = 0;
          }
          board[nr][nc] = val;
          
          if (val === 1 && r === 6 && nr === 4) {
            newPassantSquare = [5, c];
          }

          let evalScore;

          if (val === 1 && nr === 0) {
            for (let p of [5, 4, 3, 2]) {
              board[nr][nc] = p;
              const result = minimax(board, depth - 1, -1, alpha, beta, newPassantSquare);
              evalScore = Array.isArray(result) ? result[0] : -10000;
              if (evalScore > maxEval) {
                maxEval = evalScore;
                bestMove = [r, c, nr, nc, p];
              }
              alpha = Math.max(alpha, evalScore);
              if (alpha >= beta) break;
            }
            board[r][c] = val;
            board[nr][nc] = temp;
            if(isEnPassant) {
                board[nr+1][nc] = capturedPawn;
            }
            continue;
          }

          const result = minimax(board, depth - 1, -1, alpha, beta, newPassantSquare);
          evalScore = Array.isArray(result) ? result[0] : -10000;
          
          board[r][c] = val;
          board[nr][nc] = temp;
          if (isEnPassant) {
            const capturedPawnPos = [nr + 1, nc];
            board[capturedPawnPos[0]][capturedPawnPos[1]] = capturedPawn;
          }

          if (evalScore > maxEval) {
            maxEval = evalScore;
            bestMove = [r, c, nr, nc];
          }

          alpha = Math.max(alpha, evalScore);
          if (alpha >= beta) break;
        }
      }
    }
    return [maxEval, bestMove];
  } else {
    let minEval = 10000;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const val = board[r][c];
        if (val >= 0) continue;

        const moves = generateMoves(r, c, board, val, passantSquare);
        if (!moves || moves.length === 0) continue;

        for (let [nr, nc] of moves) {
          const temp = board[nr][nc];
          let newPassantSquare = null;
          let capturedPawn = 0;

          const isEnPassant = passantSquare && val === -1 && nr === passantSquare[0] && nc === passantSquare[1];

          board[r][c] = 0;
          if (isEnPassant) {
            const capturedPawnPos = [nr - 1, nc];
            capturedPawn = board[capturedPawnPos[0]][capturedPawnPos[1]];
            board[capturedPawnPos[0]][capturedPawnPos[1]] = 0;
          }
          board[nr][nc] = val;

          if (val === -1 && r === 1 && nr === 3) {
            newPassantSquare = [2, c];
          }

          let evalScore;

          if (val === -1 && nr === 7) {
            for (let p of [-5, -4, -3, -2]) {
              board[nr][nc] = p;
              const result = minimax(board, depth - 1, 1, alpha, beta, newPassantSquare);
              evalScore = Array.isArray(result) ? result[0] : 10000;
              if (evalScore < minEval) {
                minEval = evalScore;
                bestMove = [r, c, nr, nc, p];
              }
              beta = Math.min(beta, evalScore);
              if (alpha >= beta) break;
            }
            board[r][c] = val;
            board[nr][nc] = temp;
            if (isEnPassant) {
                board[nr - 1][nc] = capturedPawn;
            }
            continue;
          }

          const result = minimax(board, depth - 1, 1, alpha, beta, newPassantSquare);
          evalScore = Array.isArray(result) ? result[0] : 10000;
          
          board[r][c] = val;
          board[nr][nc] = temp;
          if (isEnPassant) {
            const capturedPawnPos = [nr - 1, nc];
            board[capturedPawnPos[0]][capturedPawnPos[1]] = capturedPawn;
          }

          if (evalScore < minEval) {
            minEval = evalScore;
            bestMove = [r, c, nr, nc];
          }
          beta = Math.min(beta, evalScore);
          if (alpha >= beta) break;
        }
      }
    }
    return [minEval, bestMove];
  }
}




// ------ play logic ------ //


const chessBoard = [
  [-4, -2, -3, -5, -6, -3, -2, -4],
  [-1, -1, -1, -1, -1, -1, -1, -1],
  [  0,  0,  0,  0,  0,  0,  0,  0],  
  [  0,  0,  0,  0,  0,  0,  0,  0], 
  [  0,  0,  0,  0,  0,  0,  0,  0], 
  [  0,  0,  0,  0,  0,  0,  0,  0],  
  [  1,  1,  1,  1,  1,  1,  1,  1], 
  [  4,  2,  3,  5,  6,  3,  2,  4], 
];

const squares = document.querySelectorAll('.square');
const board = document.querySelector('.chessboard');
const cellSize = board.offsetWidth / 8;
let isCheckmate = false;
let clickedMove = null; 
let MovedPieceName = '';
let initialPosition = null;
let passantColumn = null;
let passantRow = null;
let row_,column_;
let isCheck = false;
let currentTurn = 1;
let enPassantMoves = [];
let bR1 = 0;
let wR1 = 0;
let wR2 = 0;
let bR2 =0;
let wK = 0;
let bK = 0;
let castle;

let selectedPiece = null;
let offsetX = 0, offsetY = 0;
let originSquare = null;

for (let square of squares) {
  square.style.position = 'relative';

  const piece = square.querySelector('svg');
  if (piece) {
    piece.style.position = 'absolute';
    piece.style.top = '3px';
    piece.style.left = '3px';
    piece.style.width = '90%';
    piece.style.height = '90%';
    piece.style.pointerEvents = 'all';
    piece.style.cursor = 'grab';

    piece.addEventListener('mousedown', mousedown);
  }
}

// mouse down
function mousedown(e) {
  const piece = e.target.closest('svg');
  if (!piece) return;
  originSquare = piece.parentElement;

  const i = Array.from(squares).indexOf(originSquare);
  row_ = Math.floor(i / 8);
  column_ = i % 8;

  const val = chessBoard[row_][column_];
  console.log("courrent_position:", row_, column_)

  if (currentTurn === -1 || Math.sign(val) !== currentTurn) return;

  selectedPiece = piece;

  const rect = selectedPiece.getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();

  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  const index = Array.from(squares).indexOf(originSquare);
  row_ = Math.floor(index / 8);
  column_ = index % 8;

  board.appendChild(selectedPiece);

  selectedPiece.style.position = 'absolute';
  selectedPiece.style.width = cellSize * 0.9 + 'px';
  selectedPiece.style.height = cellSize * 0.9 + 'px';
  selectedPiece.style.zIndex = '1000';
  selectedPiece.style.left = (e.clientX - boardRect.left - offsetX) + 'px';
  selectedPiece.style.top = (e.clientY - boardRect.top - offsetY) + 'px';

  
  let validMoves;
  if(isCheck) validMoves = undercheck(row_, column_, chessBoard, val);
  else{
    validMoves = caller(row_, column_, chessBoard, val);
    castle = castling(chessBoard,val,wK,bK,wR1,wR2,bR1,bR2);
    if (castle != [] && castle != undefined) {
      let len = castle.length;
      for(let i = 0; i < len; i++) {
        const child = castle[i];
        validMoves.push(child[0]);
      }
    }
  }

if (enPassantMoves.length > 0) {
  for (const moves of enPassantMoves) {
    validMoves.push(moves)
  }
}

console.log('validmoves', validMoves)
  if(!validMoves) return;
  for(const move of validMoves) {
    const r = move[0];
    const c = move[1];
    const targetSquare = squares[r * 8 + c];
    targetSquare.style.transition = 'box-shadow 0.2s ease';
    targetSquare.style.background = 'rgba(88, 156, 52, 0.5)'; 
  }
  originSquare.style.background = 'yellow';

  document.addEventListener('mousemove', mousemove);
  document.addEventListener('mouseup', mouseup);
}

// mouse move
function mousemove(e) {
  if (!selectedPiece) return;

  const boardRect = board.getBoundingClientRect();
  let x = e.clientX - offsetX - boardRect.left;
  let y = e.clientY - offsetY - boardRect.top;

  x = Math.max(0, Math.min(x, board.offsetWidth - cellSize));
  y = Math.max(0, Math.min(y, board.offsetHeight - cellSize));

  selectedPiece.style.left = `${x}px`;
  selectedPiece.style.top = `${y}px`;
}

// mouse up
function mouseup(e) {
  if (!selectedPiece) return;

  let enCopy = [];
  const boardRect = board.getBoundingClientRect();
  const x = e.clientX - boardRect.left;
  const y = e.clientY - boardRect.top;

  if (x < 0 || y < 0 || x > boardRect.width || y > boardRect.height) {
    resetPiece();
    return;
  }

  const val = chessBoard[row_][column_];
  let validMoves;
  if(isCheck) validMoves = undercheck(row_, column_, chessBoard, val);
  else{
    validMoves = caller(row_, column_, chessBoard, val);
    castle = castling(chessBoard,val,wK,bK,wR1,wR2,bR1,bR2);
    if (castle != [] && castle != undefined) {
      let len = castle.length;
      for(let i = 0; i < len; i++) {
        const child = castle[i];
        validMoves.push(child[0]);
      }
    }
  }

    if (enPassantMoves.length > 0) {
  
    for (const moves of enPassantMoves) {
      validMoves.push(moves)
    }

    enCopy = enPassantMoves;
    enPassantMoves = [];
  }


  const row = Math.floor(y / cellSize);
  const column = Math.floor(x / cellSize);

  if(enCopy)
  {
    let ePawn;
    if(enCopy.some(move => move[0] === row && move[1] === column))
    {
      if(val === 1) ePawn = squares[(row+1) * 8 + column];
      else ePawn = squares[(row-1) * 8 +column];
      const eSvg = ePawn.querySelector("svg");
      if(eSvg) {
        eSvg.remove();
        if(val === 1) chessBoard[(row+1)][column] = 0;
        else chessBoard[(row-1)][column] = 0;
      }
    }
  }

  
  const targetSquare = squares[row * 8 + column];
  if (!targetSquare || targetSquare === originSquare || !validMoves.some(move => move[0] === row && move[1] === column)) {
    resetPiece();
    enPassantMoves = enCopy;
    return;
  }

clickedMove = validMoves.find(move => move[0] === row && move[1] === column);
MovedPieceName = selectedPiece.classList[0];
initialPosition = [row_, column_];

  console.log("hi ji:", validMoves);

 
  if (val === 6 && wK === 0 && row_ === 7 && column_ === 4) wK = 1;
  if (val === -6 && bK === 0 && row_ === 0 && column_ === 4) bK = 1;

  if (val === 4 && wR1 === 0 && row_ === 7 && column_ === 0) wR1 = 1;
  if (val === 4 && wR2 === 0 && row_ === 7 && column_ === 7) wR2 = 1;

  if (val === -4 && bR1 === 0 && row_ === 0 && column_ === 0) bR1 = 1;
  if (val === -4 && bR2 === 0 && row_ === 0 && column_ === 7) bR2 = 1;

  console.log("checking castling: ", wK, bK, wR1, wR2, bR1, bR2);
  
if (MovedPieceName.includes('pawn')) {
  if (initialPosition[0]===1) {
   if (clickedMove[0]===3 ){
    passantRow = clickedMove[0];
    passantColumn = clickedMove[1];
    enPassantMoves = enPassant(passantRow , passantColumn, chessBoard, val);

   }
  }
  else if (initialPosition[0]===6) {
   if (clickedMove[0] === 4){
    passantRow = clickedMove[0];
    passantColumn = clickedMove[1];
     enPassantMoves = enPassant(passantRow , passantColumn, chessBoard, val);
   }
  }
}
console.log('passant moves ' , enPassantMoves)

  const capturedPiece = targetSquare.querySelector('svg');
  if (capturedPiece) capturedPiece.remove();

  selectedPiece.style.position = 'absolute';
  selectedPiece.style.width = '90%';
  selectedPiece.style.height = '90%';
  selectedPiece.style.left = '3px';
  selectedPiece.style.top = '3px';
  selectedPiece.style.zIndex = '';

  targetSquare.appendChild(selectedPiece);

  for(const move of validMoves) {
    const r = move[0];
    const c = move[1];
    const targetSquare = squares[r * 8 + c];
    targetSquare.style.transition = '';
    targetSquare.style.background = ''; 
  }

  originSquare.style.background = ''; 

  console.log("mauj kar di", castle);

  if (
  castle &&
  ((row === 0 && column === 6) || (row === 0 && column === 2) ||
   (row === 7 && column === 6) || (row === 7 && column === 2))
  ) {
  let originalRook;
  let rookSquare;

  if (column === 6) {
    originalRook = squares[row * 8 + 7];
    rookSquare = squares[row * 8 + 5];
    chessBoard[row][7] = 0;
    chessBoard[row][5] = 4 * Math.sign(val);

    if (row === 7 && val === 6) wR2 = 1;
    if (row === 0 && val === -6) bR2 = 1;
  }

  else if (column === 2) {
    originalRook = squares[row * 8]; 
    rookSquare = squares[row * 8 + 3];
    chessBoard[row][0] = 0;
    chessBoard[row][3] = 4 * Math.sign(val);

    if (row === 7 && val === 6) wR1 = 1;
    if (row === 0 && val === -6) bR1 = 1;
  }

  const piece = originalRook.querySelector("svg");
  if (!piece) resetPiece();

  const newPiece = piece.cloneNode(true);
  piece.remove();
  newPiece.addEventListener('mousedown', mousedown);
  rookSquare.appendChild(newPiece);
 }

  console.log("chessBoard", chessBoard)

  chessBoard[row][column] = val;
  chessBoard[row_][column_] = 0;

if (Math.abs(val) === 1 && (row === 0 || row === 7)) {
  let isWhite = val === 1;
  waitForPromotion(isWhite,row,column).then((choice) => {
    chessBoard[row][column] = choice;
    currentTurn = -val; 
    selectedPiece = null;
      if(isCheck) isCheck = false;
      if(check(chessBoard, choice))
      {
        isCheck = true;
        isCheckmate = checkmate(chessBoard, -1 * choice);
    }
    if(isCheckmate){
      alert("Checkmate!");
        for (let i = 0; i < squares.length; i++) {
          const piece = squares[i].querySelector('svg');
          if (piece) {
            piece.removeEventListener('mousedown', mousedown);
            piece.style.cursor = 'not-allowed';
          }
        }
    }
    else if (staleMate(chessBoard, currentTurn)) {
    alert("Stalemate!");
    for (let i = 0; i < squares.length; i++) {
      const piece = squares[i].querySelector('svg');
      if (piece) {
        piece.removeEventListener('mousedown', mousedown);
        piece.style.cursor = 'not-allowed';
      }
    }
  }
  });

  originSquare = null;
  row_ = null;
  column_ = null;
  document.removeEventListener('mousemove', mousemove);
  document.removeEventListener('mouseup', mouseup);
  return;
}

  selectedPiece = null;
  originSquare = null;
  row_ = null;
  column_ = null;

  if(isCheck) isCheck = false;
    if(check(chessBoard, val))
  {
    isCheck = true;
    isCheckmate = checkmate(chessBoard, -1 * val);
  }
  enCopy = undefined;
  currentTurn *= -1;
  document.removeEventListener('mousemove', mousemove);
  document.removeEventListener('mouseup', mouseup);
  if(isCheckmate){
      alert("Checkmate!");
        for (let i = 0; i < squares.length; i++) {
          const piece = squares[i].querySelector('svg');
          if (piece) {
            piece.removeEventListener('mousedown', mousedown);
            piece.style.cursor = 'not-allowed';
          }
        }
    }
    else if (staleMate(chessBoard, currentTurn)) {
    alert("Stalemate!");
    for (let i = 0; i < squares.length; i++) {
      const piece = squares[i].querySelector('svg');
      if (piece) {
        piece.removeEventListener('mousedown', mousedown);
        piece.style.cursor = 'not-allowed';
      }
    }
  }

  if(currentTurn === -1) botmove();
}

// fallback
function resetPiece() {
  let validMoves = caller(row_, column_, chessBoard, chessBoard[row_][column_]);
  selectedPiece.style.position = 'absolute';
  selectedPiece.style.width = '90%';
  selectedPiece.style.height = '90%';
  selectedPiece.style.left = '3px';
  selectedPiece.style.top = '3px';
  selectedPiece.style.zIndex = '';

  originSquare.appendChild(selectedPiece);
  for(const move of validMoves) {
    const r = move[0];
    const c = move[1];
    const targetSquare = squares[r * 8 + c];
    targetSquare.style.transition = '';
    targetSquare.style.background = ''; 
  }
  originSquare.style.background = '';
  selectedPiece = null;
  originSquare = null;
  row_ = null;
  column_ = null;
  document.removeEventListener('mousemove', mousemove);
  document.removeEventListener('mouseup', mouseup);
}

//========================CLICK=========================

function waitForPromotion(isWhite, row, column) {
  return new Promise((resolve) => {
    const container = document.querySelector(isWhite ? '.promotion_white' : '.promotion_black');
    container.style.display = 'inline-block';

    const targetSquare = squares[row * 8 + column];

    container.querySelectorAll('button').forEach(button => {
      button.onclick = () => {
        container.style.display = 'none';

        const pieceSVG = button.querySelector('svg');
        if (!pieceSVG) {
          console.error("SVG not found in promotion button");
          return;
        }

        const newPiece = pieceSVG.cloneNode(true);
        let choice;

        switch (button.id) {
          case 'white_knight': newPiece.setAttribute("class", "white-knight"); choice = 2; break;
          case 'white_bishop': newPiece.setAttribute("class", "white-bishop"); choice = 3; break;
          case 'white_rook':   newPiece.setAttribute("class", "white-rook");   choice = 4; break;
          case 'white_queen':  newPiece.setAttribute("class", "white-queen");  choice = 5; break;
          case 'black_knight': newPiece.setAttribute("class", "black-knight"); choice = -2; break;
          case 'black_bishop': newPiece.setAttribute("class", "black-bishop"); choice = -3; break;
          case 'black_rook':   newPiece.setAttribute("class", "black-rook");   choice = -4; break;
          case 'black_queen':  newPiece.setAttribute("class", "black-queen");  choice = -5; break;
          default:
            console.error("Invalid promotion choice");
            return;
        }

        const oldPiece = targetSquare.querySelector('svg');
        if (oldPiece) oldPiece.remove();

        targetSquare.appendChild(newPiece);
        newPiece.addEventListener('mousedown', mousedown);
        newPiece.classList.add('piece');
        newPiece.style.position = 'absolute';
        newPiece.style.top = '3px';
        newPiece.style.left = '3px';
        newPiece.style.width = '90%';
        newPiece.style.height = '90%';
        newPiece.style.pointerEvents = 'all';
        newPiece.style.cursor = 'grab'

        resolve(choice);
      };
    });
  });
}

function botmove() {
  const [evalScore, bestMove] = minimax(chessBoard, 3, -1, -Infinity, Infinity);

  if (!bestMove) return;

  const [r, c, nr, nc, promotion] = bestMove;
  const fromIdx = r * 8 + c;
  const toIdx = nr * 8 + nc;

  const fromSquare = squares[fromIdx];
  const toSquare = squares[toIdx];

  const piece = fromSquare.querySelector('svg');
  if (!piece) return;

  const captured = toSquare.querySelector('svg');
  if (captured) captured.remove();

  // Clear from square and move piece
  fromSquare.innerHTML = '';
  toSquare.appendChild(piece);
  piece.style.position = 'absolute';
  piece.style.top = '3px';
  piece.style.left = '3px';
  piece.style.width = '90%';
  piece.style.height = '90%';
  piece.style.pointerEvents = 'all';
  piece.style.cursor = 'grab';

  // Update board state
  chessBoard[nr][nc] = promotion !== undefined ? promotion : chessBoard[r][c];
  chessBoard[r][c] = 0;

  // Handle promotion rendering
  if (promotion !== undefined) {
    const isWhite = promotion > 0;
    const container = document.querySelector(isWhite ? '.promotion_white' : '.promotion_black');
    const button = container.querySelector(
      isWhite ? `#white_${getPieceName(promotion)}` : `#black_${getPieceName(promotion)}`
    );
    if (button) {
      const pieceSVG = button.querySelector('svg');
      if (pieceSVG) {
        const newPiece = pieceSVG.cloneNode(true);
        toSquare.innerHTML = '';
        toSquare.appendChild(newPiece);
        newPiece.classList.add('piece');
        newPiece.addEventListener('mousedown', mousedown);
        newPiece.style.position = 'absolute';
        newPiece.style.top = '3px';
        newPiece.style.left = '3px';
        newPiece.style.width = '90%';
        newPiece.style.height = '90%';
        newPiece.style.pointerEvents = 'all';
        newPiece.style.cursor = 'grab';
      }
    }
  }

  const botPiece = chessBoard[nr][nc];
  if (ifCheck(chessBoard, botPiece)) {
    isCheck = true;
    isCheckmate = checkmate(chessBoard, -1 * botPiece);
    if (isCheckmate) alert("Checkmate!");
  } else {
    isCheck = false;
  }

  console.log("gamestate: ", chessBoard);

  currentTurn *= -1;
}

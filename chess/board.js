function generateChessboard() {
  const chessboard = document.querySelector(".chessboard");

  let black_king = document.querySelector(".black-king");
  let white_king = document.querySelector(".white-king"); 
  let black_queen = document.querySelector(".black-queen");
  let white_queen = document.querySelector(".white-queen");
  let black_rook = document.querySelector(".black-rook");
  let white_rook = document.querySelector(".white-rook");
  let black_bishop = document.querySelector(".black-bishop");
  let white_bishop = document.querySelector(".white-bishop");
  let black_knight = document.querySelector(".black-knight");
  let white_knight = document.querySelector(".white-knight");
  let black_pawn = document.querySelector(".black-pawn");
  let white_pawn = document.querySelector(".white-pawn");

  const initialPosition = {
    "a1": white_rook,
    "b1": white_knight,
    "c1": white_bishop,
    "e1": white_king,
    "d1": white_queen,
    "f1": white_bishop,
    "g1": white_knight,
    "h1": white_rook,

    "a2": white_pawn,
    "b2": white_pawn,
    "c2": white_pawn,
    "d2": white_pawn,
    "e2": white_pawn,
    "f2": white_pawn,
    "g2": white_pawn,
    "h2": white_pawn,

    "a8": black_rook,
    "b8": black_knight,
    "c8": black_bishop,
    "e8": black_king,
    "d8": black_queen,
    "f8": black_bishop,
    "g8": black_knight,
    "h8": black_rook,

    "a7": black_pawn,
    "b7": black_pawn,
    "c7": black_pawn,
    "d7": black_pawn,
    "e7": black_pawn,
    "f7": black_pawn,
    "g7": black_pawn,
    "h7": black_pawn
  };

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let x_coordinate = String.fromCharCode(97 + j);
      let val = 8 - i;
      let position = x_coordinate + val;

      let cell = document.createElement("div");
      cell.classList.add("square");
      if ((i + j) % 2 === 0) {
        cell.classList.add("white");
      } else {
        cell.classList.add("black");
      }

      if (j === 0) {
        let label = document.createElement("div");
        label.classList.add("label");
        label.innerText = val;
        cell.appendChild(label);
      }

      if (i === 7) {
        let label_ = document.createElement("div");
        label_.classList.add("label_");
        label_.innerText = x_coordinate;
        cell.appendChild(label_);
      }

      chessboard.appendChild(cell);
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let x_coordinate = String.fromCharCode(97 + j);
      let val = 8 - i;
      let position = x_coordinate + val;
      const piece = initialPosition[position];
      if (piece) {
        const square = chessboard.children[i * 8 + j];
        const pieceClone = piece.cloneNode(true);
        pieceClone.classList.add("piece");
        square.appendChild(pieceClone);
      }
    }
  }

  const originals = [
    black_king, white_king,
    black_queen, white_queen,
    black_rook, white_rook,
    black_bishop, white_bishop,
    black_knight, white_knight,
    black_pawn, white_pawn
  ];

  originals.forEach(el => el?.remove()); 
}

generateChessboard();

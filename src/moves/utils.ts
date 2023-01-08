export function nextLetter(letter: string) {
  const nextLetter = String.fromCharCode(
    letter.charCodeAt(letter.length - 1) + 1
  );

  return nextLetter.toUpperCase() !== nextLetter.toLowerCase()
    ? nextLetter
    : "";
}

export function prevLetter(letter: string) {
  const prevLetter = String.fromCharCode(
    letter.charCodeAt(letter.length - 1) - 1
  );
  return prevLetter.toUpperCase() !== prevLetter.toLowerCase()
    ? prevLetter
    : "";
}

function currLetter(number: number) {
  return String.fromCharCode(94 + (number + 3));
}

export function fen(fen: string) {
  //const test = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

  const pieces: any = {
    r: "rook",
    n: "knight",
    b: "bishop",
    q: "queen",
    k: "king",
    p: "pawn",
  };

  // convert to FEN format
  const boardState: any = {};
  // split FEND string into rows
  const rows = fen.split("/");

  rows.reverse().forEach((row: any, idx: number) => {
    let i = 0;
    idx++;

    for (let square in row) {
      let sq = row[square];
      if (+sq) {
        i = +sq + i;
      } else {
        let color = sq === sq.toUpperCase() ? "w" : "b";
        boardState[`${currLetter(i)}${idx}`] = {
          p: pieces[sq.toLowerCase()],
          c: color,
        };
        i++;
      }
    }
  });

  console.log(boardState);
  return boardState;

  // convert back
}

function fenToObject(fen: string): { [key: string]: { p: string; c: string } } {
  const rows = fen.split(" ")[0].split("/");
  const result: { [key: string]: { p: string; c: string } } = {};

  let rowIndex = 8;
  for (const row of rows) {
    let colIndex = "a";
    for (const cell of row) {
      if (Number.isInteger(parseInt(cell))) {
        colIndex = String.fromCharCode(colIndex.charCodeAt(0) + parseInt(cell));
      } else {
        result[colIndex + rowIndex] = {
          p: cellToPiece(cell),
          c: cellToColor(cell),
        };
        colIndex = String.fromCharCode(colIndex.charCodeAt(0) + 1);
      }
    }
    rowIndex--;
  }

  return result;
}

function cellToPiece(cell: string): string {
  const pieceMap: any = {
    P: "pawn",
    N: "knight",
    B: "bishop",
    R: "rook",
    Q: "queen",
    K: "king",
  };
  return pieceMap[cell.toUpperCase()] || "";
}

function cellToColor(cell: string): "w" | "b" {
  return cell === cell.toUpperCase() ? "w" : "b";
}

export function objectToFen(obj: {
  [key: string]: { p: string; c: "w" | "b" };
}): string {
  let fen = "";
  for (let row = 8; row > 0; row--) {
    let emptySquares = 0;
    for (
      let col = "a";
      col <= "h";
      col = String.fromCharCode(col.charCodeAt(0) + 1)
    ) {
      const cell: { p: string; c: "w" | "b" } = obj[col + row];
      if (cell) {
        if (emptySquares) {
          fen += emptySquares;
          emptySquares = 0;
        }
        fen += pieceToCell(cell.p, cell.c);
      } else {
        emptySquares++;
      }
    }
    if (emptySquares) {
      fen += emptySquares;
    }
    if (row > 1) {
      fen += "/";
    }
  }
  return fen;
}

function pieceToCell(piece: string, color: "w" | "b"): string {
  const colorMap = {
    b: "",
    w: "",
  };
  const pieceMap = {
    pawn: "P",
    knight: "N",
    bishop: "B",
    rook: "R",
    queen: "Q",
    king: "K",
  } as Record<string, string>;
  return colorMap[color] + pieceMap[piece];
}

function enPassant(move: string, boardState: any) {
  // Check if the pawn at the starting position of the move is making a two-square advance
  const fromPos = move.slice(0, 2);
  const toPos = move.slice(2, 4);
  const piece = boardState[fromPos];
  if (
    piece.p === "pawn" &&
    ((fromPos[1] === "7" && toPos[1] === "5") ||
      (fromPos[1] === "2" && toPos[1] === "4"))
  ) {
    // Check if there is an enemy pawn to the left or right that could have advanced two squares on its previous move
    const enemyPawnPos =
      fromPos[0] === "a"
        ? `${String.fromCharCode(fromPos.charCodeAt(0) + 1)}${fromPos[1]}`
        : fromPos[0] === "h"
        ? `${String.fromCharCode(fromPos.charCodeAt(0) - 1)}${fromPos[1]}`
        : null;
    if (
      enemyPawnPos &&
      boardState[enemyPawnPos] &&
      boardState[enemyPawnPos].p === "pawn" &&
      boardState[enemyPawnPos].c !== piece.c
    ) {
      // Update the board state to reflect the capture
      const newBoardState = { ...boardState };
      delete newBoardState[enemyPawnPos];
      return newBoardState;
    }
  }
  // If the pawn is not making a two-square advance, or if there is no enemy pawn that can be captured en passant, then return the original board state
  return boardState;
}

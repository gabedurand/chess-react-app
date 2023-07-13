const pawnMoves = (x: number, y: string, color: string, board?: any) => {
  let firstPawnMove = `${y}${color === "b" ? x - 2 : x + 2}`;
  let nextPawnMove = `${y}${color === "b" ? x - 1 : x + 1}`;
  const col = y.charCodeAt(0);
  const captureLeft = `${String.fromCharCode(col - 1)}${
    color === "b" ? x - 1 : x + 1
  }`;
  const captureRight = `${String.fromCharCode(col + 1)}${
    color === "b" ? x - 1 : x + 1
  }`;
  return [
    // only allow pawn to move forward if there is no piece in front
    `${!board[nextPawnMove]?.p ? nextPawnMove : ""}`,

    // only allow pawns to move 2 spaces at beginning
    `${(x === 2 || x === 7) && !board[nextPawnMove]?.p && firstPawnMove}`,
    // allow pawns to capture diagonally
    `${
      board[captureLeft] && board[captureLeft]?.c !== color ? captureLeft : ""
    }`,
    `${
      board[captureRight] && board[captureRight]?.c !== color
        ? captureRight
        : ""
    }`,
  ].filter((x) => x);
};

export default pawnMoves;

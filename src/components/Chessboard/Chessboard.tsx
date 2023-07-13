import { useState } from "react";
import { fen } from "../../moves/utils";
import { useBoardStore } from "../../store/board";
import Tilt from "../Tile/Tile";
import "./Chessboard.css";

const horizontalSquares = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalSquares = [1, 2, 3, 4, 5, 6, 7, 8];

const initialSetup: any = {
  a1: {
    p: "rook",
    c: "b",
  },
  b1: {
    p: "knight",
    c: "b",
  },
  c1: {
    p: "bishop",
    c: "b",
  },
  d1: {
    p: "queen",
    c: "b",
  },
  e1: {
    p: "king",
    c: "b",
  },
  f1: {
    p: "bishop",
    c: "b",
  },
  g1: {
    p: "knight",
    c: "b",
  },
  h1: {
    p: "rook",
    c: "b",
  },
  a2: {
    p: "pawn",
    c: "b",
  },
  b2: {
    p: "pawn",
    c: "b",
  },
  c2: {
    p: "pawn",
    c: "b",
  },
  d2: {
    p: "pawn",
    c: "b",
  },
  e2: {
    p: "pawn",
    c: "b",
  },
  f2: {
    p: "pawn",
    c: "b",
  },
  g2: {
    p: "pawn",
    c: "b",
  },
  h2: {
    p: "pawn",
    c: "b",
  },
  a7: {
    p: "pawn",
    c: "w",
  },
  b7: {
    p: "pawn",
    c: "w",
  },
  c7: {
    p: "pawn",
    c: "w",
  },
  d7: {
    p: "pawn",
    c: "w",
  },
  e7: {
    p: "pawn",
    c: "w",
  },
  f7: {
    p: "pawn",
    c: "w",
  },
  g7: {
    p: "pawn",
    c: "w",
  },
  h7: {
    p: "pawn",
    c: "w",
  },
  a8: {
    p: "rook",
    c: "w",
  },
  b8: {
    p: "knight",
    c: "w",
  },
  c8: {
    p: "bishop",
    c: "w",
  },
  d8: {
    p: "queen",
    c: "w",
  },
  e8: {
    p: "king",
    c: "w",
  },
  f8: {
    p: "bishop",
    c: "w",
  },
  g8: {
    p: "knight",
    c: "w",
  },
  h8: {
    p: "rook",
    c: "w",
  },
};

export default function Chessboard() {
  const [boardState, setBoardState] = useState(
    fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
    //fen("rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R")
  );
  const [tileFrom, setTileFrom] = useState("");
  const [tileTo, setTileTo] = useState("");
  const [activeSquare, setActiveSquare] = useState("");
  const [hightlighMoves, setHightlighMoves] = useState([]);

  const boardStore: any = useBoardStore();

  boardStore.board = boardState;

  // useEffect(() => {
  //   // fen("4kb1r/p4ppp/4q3/8/8/1B6/PPP2PPP/2KR4");
  // }, [boardState]);

  const resetBoard = () => {
    setBoardState(initialSetup);
    boardStore.wCaptured = [];
    boardStore.bCaptured = [];
    resetTiles();
    setHightlighMoves([]);
  };

  const resetTiles = () => {
    setTileTo("");
    setTileFrom("");
    setActiveSquare("");
    setHightlighMoves([]);
  };

  const handleTileClick = (square: string) => {
    // check if piece

    // check for valid moves
    if (
      hightlighMoves.length &&
      !hightlighMoves.filter((m) => m === square)[0]
    ) {
      resetTiles();
      return;
    }

    if (square === activeSquare) {
      resetTiles();
      return;
    }

    // set as from square
    if (!activeSquare) {
      setTileFrom(square);
      setActiveSquare(square);
      console.log("setting from " + square);
      return;
    }

    const getPiece = boardState[tileFrom];
    // if from square set, set as to square
    setTileTo(square);
    console.log(getPiece.p + " to " + square);

    // move piece
    let newBoard = {
      ...boardState,
    };
    newBoard[tileFrom] = {};

    // capture piece if exists on selected square
    const capturePiece = newBoard[square];
    if (capturePiece?.p) {
      console.log(capturePiece);
      let piece = capturePiece.p;
      let color = capturePiece.c;
      // store captured piece
      boardStore[`${color}Captured`].push(`${piece}_${color}`);
      console.log(`=== captured ${capturePiece}! ===`);
    }
    newBoard[square] = getPiece;

    setBoardState(newBoard);
    resetTiles();
  };

  const board: any = [];
  let count = verticalSquares.length;
  horizontalSquares.forEach((_, i) => {
    verticalSquares.reverse().forEach((_, j) => {
      const tileNumber = j + i + 1;
      const square = horizontalSquares[j] + count;
      let p,
        c = null;

      if (boardState[square]) {
        p = boardState[square].p;
        c = boardState[square].c;
      }

      board.push(
        <Tilt
          boardState={boardState}
          handleTileClick={handleTileClick}
          active={activeSquare}
          highlight={hightlighMoves.find((h) => h === square)}
          setHightlighMoves={setHightlighMoves}
          piece={p}
          color={c}
          key={square}
          tile={square}
          tileNumber={tileNumber}
        />
      );
    });
    count--;
  });

  return (
    <>
      <div id="captured">
        {boardStore.wCaptured.map((piece: string, idx: number) => (
          <div className="captured-piece" key={idx}>
            <img width="30" alt={piece} src={`/assets/images/${piece}.png`} />
          </div>
        ))}
      </div>
      <button>
        from:{tileFrom} - to:{tileTo}
      </button>
      <div id="chessboard">{board}</div>
      <button onClick={() => resetBoard()}>reset</button>
      <div id="captured">
        {boardStore.bCaptured.map((piece: string, idx: number) => (
          <div className="captured-piece" key={idx}>
            <img width="30" alt={piece} src={`/assets/images/${piece}.png`} />
          </div>
        ))}
      </div>
    </>
  );
}

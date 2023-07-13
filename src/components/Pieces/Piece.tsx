export interface PieceType {
  piece: any;
  color: "b" | "w";
  square: string;
}

const ChessPiece = ({ piece = "pawn", color = "w", square }: PieceType) => {
  return (
    <div>
      <img alt={piece} src={`/assets/images/${piece}_${color}.png`} />
    </div>
  );
};

export default ChessPiece;

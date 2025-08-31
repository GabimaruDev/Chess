import { FC, memo, useMemo } from "react";
import { useAppSelector } from "../hook";
import { Colors } from "../models/Colors";
import { FigureNames } from "../models/figures/Figure";
import { CellComponentProps } from "../types";

const CellComponent: FC<CellComponentProps> = (props) => {
  const { cell, selected, click, currentPlayer, isCurrentKingInCheck } = props;
  const gameState = useAppSelector((state) => state.chess);

  const isKingInCheck = useMemo(() => {
    if (cell.figure?.name === FigureNames.KING && cell.figure.color === currentPlayer.color) {
      return !!isCurrentKingInCheck;
    }
    return false;
  }, [cell.figure?.name, currentPlayer.color]);

  return (
    <div
      className={[
        "cell",
        selected ? "selected" : "",
        cell.available && cell.figure ? "available-enemy" : "",
        currentPlayer.color === Colors.BLACK && cell.figure ? "swapPlayer" : "",
        gameState.isCheck && isKingInCheck ? "check" : "",
      ].join(" ")}
      onClick={() => click(cell)}
    >
      {cell.available && !cell.figure && <div className="available" />}
      {cell.figure?.logo && <img src={cell.figure.logo} alt="" />}
    </div>
  );
};

export default memo(CellComponent);

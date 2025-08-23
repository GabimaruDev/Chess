import { FC } from "react";
import { useAppSelector } from "../hook";
import { Colors } from "../models/Colors";
import { FigureNames } from "../models/figures/Figure";
import { CellComponentProps } from "../types";

const CellComponent: FC<CellComponentProps> = (props) => {
    const { cell, selected, click } = props;
    const gameState = useAppSelector((state) => state.chess);
    const isKingInCheck =
        cell.figure?.name === FigureNames.KING &&
        cell.figure.color === gameState.currentPlayer.color &&
        cell.board.isKingInCheck(gameState.currentPlayer.color);

    return (
        <div
            className={[
                "cell",
                cell.color,
                selected ? "selected" : "",
                cell.available && cell.figure ? "available-enemy" : "",
                gameState.currentPlayer.color === Colors.BLACK ? "swapPlayer" : "",
                isKingInCheck ? "check" : "",
            ].join(" ")}
            onClick={() => click(cell)}
        >
            {cell.available && !cell.figure && <div className="available" />}
            {cell.figure?.logo && <img src={cell.figure.logo} alt="" />}
        </div>
    );
};

export default CellComponent;

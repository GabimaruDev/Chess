import { FC } from "react";
import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { Player } from "../models/Player";

interface CellProps {
    cell: Cell;
    selected: boolean;
    click: (cell: Cell) => void;
    currentPlayer: Player;
}

const CellComponent: FC<CellProps> = (props) => {
    const { cell, selected, click, currentPlayer } = props;
    return (
        <div
            className={[
                "cell",
                cell.color,
                selected ? "selected" : "",
                cell.available && cell.figure ? "available-enemy" : "",
                currentPlayer.color === Colors.BLACK ? "swapPlayer" : "",
            ].join(" ")}
            onClick={() => click(cell)}
        >
            {cell.available && !cell.figure && <div className="available" />}
            {cell.figure?.logo && <img src={cell.figure.logo} alt="" />}
        </div>
    );
};

export default CellComponent;

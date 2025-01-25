import React, { FC, useCallback, useEffect } from "react";
import { Board } from "../models/Board";
import CellComponent from "./CellComponent";
import { Cell } from "../models/Cell";
import { Player } from "../models/Player";
import { Colors } from "../models/Colors";

interface BoardProps {
    board: Board;
    setBoard: (board: Board) => void;
    currentPlayer: Player;
    swapPlayer: () => void;
    selectedCell: Cell | null;
    setSelectedCell: (cell: Cell | null) => void;
}

const BoardComponent: FC<BoardProps> = ({
    board,
    setBoard,
    currentPlayer,
    swapPlayer,
    selectedCell,
    setSelectedCell,
}) => {
    function click(cell: Cell) {
        if (selectedCell !== cell && selectedCell?.figure?.canMove(cell)) {
            selectedCell.moveFigure(cell);
            setSelectedCell(null);
            swapPlayer();
        } else if (cell.figure) {
            if (cell.figure?.color === currentPlayer?.color) setSelectedCell(cell);
        } else {
            setSelectedCell(null);
        }
    }

    const updateBoard = useCallback(() => {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }, [board, setBoard])

    const highlightCells = useCallback(() => {
        board.highlightCells(selectedCell, currentPlayer.color);
        updateBoard();
    }, [board, currentPlayer.color, selectedCell, updateBoard])

    useEffect(() => {
        highlightCells();
    }, [highlightCells, selectedCell]);

    return (
        <div
            className={["board", currentPlayer.color === Colors.BLACK ? "swapPlayer" : ""].join(
                " "
            )}>
            {board.cells.map((row, index) => (
                <React.Fragment key={index}>
                    {row.map((cell) => (
                        <CellComponent
                            click={click}
                            cell={cell}
                            selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
                            key={cell.id}
                            currentPlayer={currentPlayer}
                        />
                    ))}
                </React.Fragment>
            ))}
        </div>
    );
};

export default BoardComponent;

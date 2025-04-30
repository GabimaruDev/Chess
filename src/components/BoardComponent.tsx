import React, { FC, useCallback, useEffect } from "react";
import { Board } from "../models/Board";
import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { FigureNames } from "../models/figures/Figure";
import { Player } from "../models/Player";
import CellComponent from "./CellComponent";
import ModalTransformPawn from "./ModalTransformPawn";

interface BoardProps {
    board: Board;
    setBoard: (board: Board) => void;
    currentPlayer: Player;
    swapPlayer: () => void;
    selectedCell: Cell | null;
    setSelectedCell: (cell: Cell | null) => void;
}

const BoardComponent: FC<BoardProps> = (props) => {
    const { board, setBoard, currentPlayer, swapPlayer, selectedCell, setSelectedCell } = props;

    const click = (cell: Cell) => {
        if (selectedCell !== cell && selectedCell?.figure?.canMove(cell)) {
            if (selectedCell.figure.name === FigureNames.PAWN && (cell.y === 7 || cell.y === 0)) {
                board.advancedPawnCell = cell;
            }
            selectedCell.moveFigure(cell);
            setSelectedCell(null);
            swapPlayer();
        } else if (cell.figure) {
            if (cell.figure?.color === currentPlayer?.color) setSelectedCell(cell);
        } else {
            setSelectedCell(null);
        }
    };

    const updateBoard = () => {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    };

    const highlightCells = useCallback(() => {
        board.highlightCells(selectedCell, currentPlayer.color);
        updateBoard();
    }, [selectedCell]);

    useEffect(() => {
        highlightCells();
    }, [selectedCell]);

    return (
        <>
            <div
                className={["board", currentPlayer.color === Colors.BLACK ? "swapPlayer" : ""].join(
                    " "
                )}
            >
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
            {board.advancedPawnCell ? (
                <ModalTransformPawn board={board} updateBoard={updateBoard} />
            ) : (
                ""
            )}
        </>
    );
};

export default BoardComponent;

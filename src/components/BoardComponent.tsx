import React, { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hook";
import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { FigureNames } from "../models/figures/Figure";
import { Player } from "../models/Player";
import { setBoard, setSelectedCell, swapPlayer } from "../store/slices";
import CellComponent from "./CellComponent";
import ModalTransformPawn from "./ModalTransformPawn";

const BoardComponent = () => {
    const dispatch = useAppDispatch();
    const gameState = useAppSelector((state) => state.chess);

    const handleCellClick = useCallback(
        (cell: Cell) => {
            if (gameState.selectedCell && gameState.selectedCell !== cell && cell.available) {
                if (
                    gameState.selectedCell.figure?.name === FigureNames.PAWN &&
                    (cell.y === 7 || cell.y === 0)
                ) {
                    gameState.advancedPawnCell = cell;
                }

                gameState.selectedCell.moveFigure(cell);
                dispatch(setSelectedCell(null));
                dispatch(
                    swapPlayer(
                        gameState.currentPlayer.color === Colors.WHITE
                            ? new Player(Colors.BLACK)
                            : new Player(Colors.WHITE)
                    )
                );
            } else if (cell.figure?.color === gameState.currentPlayer.color) {
                dispatch(setSelectedCell(cell));
            } else {
                dispatch(setSelectedCell(null));
            }
        },
        [
            gameState.selectedCell,
            gameState.currentPlayer.color,
            gameState.board,
            setSelectedCell,
            swapPlayer,
        ]
    );

    const updateBoard = useCallback(() => {
        const newBoard = gameState.board.getCopyBoard();
        dispatch(setBoard(newBoard));
    }, [gameState.board, setBoard]);

    const highlightCells = useCallback(() => {
        gameState.board.highlightCells(gameState.selectedCell, gameState.currentPlayer.color);
        updateBoard();
    }, [gameState.selectedCell, gameState.currentPlayer.color, gameState.board, updateBoard]);

    useEffect(() => {
        highlightCells();
    }, [gameState.selectedCell]);

    const boardClassName = [
        "board",
        gameState.currentPlayer.color === Colors.BLACK ? "swapPlayer" : "",
    ].join(" ");

    const isSelected = useCallback(
        (cell: Cell) => {
            return cell.x === gameState.selectedCell?.x && cell.y === gameState.selectedCell?.y;
        },
        [gameState.selectedCell]
    );

    return (
        <>
            <div className={boardClassName}>
                {gameState.board.cells.map((row, index) => (
                    <React.Fragment key={index}>
                        {row.map((cell) => (
                            <CellComponent
                                key={cell.id}
                                cell={cell}
                                selected={isSelected(cell)}
                                click={handleCellClick}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
            {gameState.advancedPawnCell && (
                <ModalTransformPawn board={gameState.board} updateBoard={updateBoard} />
            )}
        </>
    );
};

export default BoardComponent;

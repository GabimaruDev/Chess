import React, { FC, useCallback, useEffect } from "react";
import { Board } from "../models/Board";
import CellComponent from "./CellComponent";
import { Cell } from "../models/Cell";
import { Player } from "../models/Player";
import { Colors } from "../models/Colors";
import { FigureNames } from "../models/figures/Figure";
import { Button, Modal } from "react-bootstrap";
import { Queen } from "../models/figures/Queen";
import { Rook } from "../models/figures/Rook";
import { Knight } from "../models/figures/Knight";
import { Bishop } from "../models/figures/Bishop";

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

    const pawnTransformation = (figure: FigureNames, cell: Cell, color?: Colors) => {
        if (figure === FigureNames.QUEEN && color) {
            new Queen(color, cell);
        }
        if (figure === FigureNames.ROOK && color) {
            new Rook(color, cell);
        }
        if (figure === FigureNames.KNIGHT && color) {
            new Knight(color, cell);
        }
        if (figure === FigureNames.BISHOP && color) {
            new Bishop(color, cell);
        }
    };

    const handleAdvancedPawn = (figure: FigureNames, color?: Colors) => {
        if (board.advancedPawnCell) {
            pawnTransformation(figure, board.advancedPawnCell, color);
            board.advancedPawnCell = null;
            updateBoard();
        }
    };

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
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>
                            <b>Ваша пешка дошла до последней линии!</b>
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>Выбери фигуру, в которую превратится твоя пешка!</Modal.Body>

                    <Modal.Footer>
                        <Button
                            onClick={() =>
                                handleAdvancedPawn(
                                    FigureNames.QUEEN,
                                    board.advancedPawnCell?.figure?.color
                                )
                            }
                        >
                            Ферзь
                        </Button>
                        <Button
                            onClick={() =>
                                handleAdvancedPawn(
                                    FigureNames.KNIGHT,
                                    board.advancedPawnCell?.figure?.color
                                )
                            }
                        >
                            Конь
                        </Button>
                        <Button
                            onClick={() =>
                                handleAdvancedPawn(
                                    FigureNames.BISHOP,
                                    board.advancedPawnCell?.figure?.color
                                )
                            }
                        >
                            Слон
                        </Button>
                        <Button
                            onClick={() =>
                                handleAdvancedPawn(
                                    FigureNames.ROOK,
                                    board.advancedPawnCell?.figure?.color
                                )
                            }
                        >
                            Ладья
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            ) : (
                ""
            )}
        </>
    );
};

export default BoardComponent;

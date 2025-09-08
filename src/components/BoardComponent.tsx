import React, { FC, useCallback, useEffect, useMemo } from "react";
import useSound from "use-sound";
import move from "../assets/sounds/move.mp3";
import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { FigureNames } from "../models/figures/Figure";
import { BoardComponentProps } from "../types";
import CellComponent from "./CellComponent";
import ModalTransformPawn from "./ModalTransformPawn";

const BoardComponent: FC<BoardComponentProps> = (props) => {
  const { board, setBoard, currentPlayer, swapPlayer, selectedCell, setSelectedCell } = props;
  const [moveSound] = useSound(move, { volume: 0.75 });

  const handleCellClick = useCallback(
    (cell: Cell) => {
      if (selectedCell && selectedCell !== cell && cell.available) {
        board.passingPawn = null;
        if (selectedCell.figure?.name === FigureNames.PAWN) {
          const direction = selectedCell.figure.color == Colors.BLACK ? 1 : -1;
          if (cell.y === 7 || cell.y === 0) board.advancedPawnCell = cell;
          if (selectedCell.figure.isFirstStep && cell.y === selectedCell.y + direction * 2) {
            board.passingPawn = board.getCell(cell.y - direction, cell.x);
          }
        }

        selectedCell.moveFigure(cell);
        moveSound({ playbackRate: Math.random() * (1.5 - 1.1) + 1.1 });
        setSelectedCell(null);
        swapPlayer();
      } else if (cell.figure?.color === currentPlayer.color) {
        setSelectedCell(cell);
      } else {
        setSelectedCell(null);
      }
    },
    [selectedCell, currentPlayer.color, board]
  );

  const updateBoard = useCallback(() => {
    setBoard(board.getCopyBoard());
  }, [board, setBoard]);

  const highlightCells = useCallback(() => {
    board.highlightCells(selectedCell, currentPlayer.color);
    updateBoard();
  }, [selectedCell, currentPlayer.color, board]);

  useEffect(() => {
    highlightCells();
  }, [selectedCell]);

  const boardClassName = useMemo(() => {
    return ["board", currentPlayer.color === Colors.BLACK ? "swapPlayer" : ""].join(" ");
  }, [currentPlayer.color]);

  const isSelected = useCallback(
    (cell: Cell) => {
      return cell.x === selectedCell?.x && cell.y === selectedCell?.y;
    },
    [selectedCell]
  );

  const isCurrentKingInCheck = useMemo(() => {
    return board.isKingInCheck(currentPlayer.color);
  }, [board, currentPlayer.color]);

  return (
    <>
      <div className={boardClassName}>
        {board.cells.map((row, index) => (
          <React.Fragment key={index}>
            {row.map((cell) => (
              <CellComponent
                key={cell.id}
                cell={cell}
                selected={isSelected(cell)}
                click={handleCellClick}
                currentPlayer={currentPlayer}
                isCurrentKingInCheck={isCurrentKingInCheck}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
      {board.advancedPawnCell && <ModalTransformPawn board={board} updateBoard={updateBoard} />}
    </>
  );
};

export default BoardComponent;

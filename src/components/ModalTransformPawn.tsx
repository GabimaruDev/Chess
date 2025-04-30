import { FC } from "react";
import bishopLogoBlack from "../assets/images/min-black-bishop.png";
import knightLogoBlack from "../assets/images/min-black-knight.png";
import queenLogoBlack from "../assets/images/min-black-queen.png";
import rookLogoBlack from "../assets/images/min-black-rook.png";
import bishopLogoYellow from "../assets/images/min-yellow-bishop.png";
import knightLogoYellow from "../assets/images/min-yellow-knight.png";
import queenLogoYellow from "../assets/images/min-yellow-queen.png";
import rookLogoYellow from "../assets/images/min-yellow-rook.png";
import { Board } from "../models/Board";
import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { Bishop } from "../models/figures/Bishop";
import { FigureNames } from "../models/figures/Figure";
import { Knight } from "../models/figures/Knight";
import { Queen } from "../models/figures/Queen";
import { Rook } from "../models/figures/Rook";
import ModalWindow from "./ModalWindow";

interface ModalTransformPawnProps {
    board: Board;
    updateBoard: () => void;
}

const ModalTransformPawn: FC<ModalTransformPawnProps> = (props) => {
    const { board, updateBoard } = props;
    const sizeImg = 36;

    const pawnTransformation = (figure: FigureNames, cell: Cell, color: Colors) => {
        switch (figure) {
            case FigureNames.QUEEN:
                new Queen(color, cell);
                break;
            case FigureNames.ROOK:
                new Rook(color, cell);
                break;
            case FigureNames.KNIGHT:
                new Knight(color, cell);
                break;
            case FigureNames.BISHOP:
                new Bishop(color, cell);
                break;
            default:
                break;
        }
    };

    const handleAdvancedPawn = (figure: FigureNames, color?: Colors) => {
        if (board.advancedPawnCell && color) {
            pawnTransformation(figure, board.advancedPawnCell, color);
            board.advancedPawnCell = null;
            updateBoard();
        }
    };

    const title = "Ваша пешка дошла до последней линии!";
    const body = "Выбери фигуру, в которую превратится твоя пешка!";
    const footer = (
        <>
            <button
                className="btn"
                onClick={() =>
                    handleAdvancedPawn(FigureNames.QUEEN, board.advancedPawnCell?.figure?.color)
                }
            >
                <img
                    src={
                        board.advancedPawnCell?.figure?.color === Colors.BLACK
                            ? queenLogoBlack
                            : queenLogoYellow
                    }
                    width={sizeImg}
                    height={sizeImg}
                    alt="queen"
                />
            </button>
            <button
                className="btn"
                onClick={() =>
                    handleAdvancedPawn(FigureNames.KNIGHT, board.advancedPawnCell?.figure?.color)
                }
            >
                <img
                    src={
                        board.advancedPawnCell?.figure?.color === Colors.BLACK
                            ? knightLogoBlack
                            : knightLogoYellow
                    }
                    width={sizeImg}
                    height={sizeImg}
                    alt="knight"
                />
            </button>
            <button
                className="btn"
                onClick={() =>
                    handleAdvancedPawn(FigureNames.BISHOP, board.advancedPawnCell?.figure?.color)
                }
            >
                <img
                    src={
                        board.advancedPawnCell?.figure?.color === Colors.BLACK
                            ? bishopLogoBlack
                            : bishopLogoYellow
                    }
                    width={sizeImg}
                    height={sizeImg}
                    alt="bishop"
                />
            </button>
            <button
                className="btn"
                onClick={() =>
                    handleAdvancedPawn(FigureNames.ROOK, board.advancedPawnCell?.figure?.color)
                }
            >
                <img
                    src={
                        board.advancedPawnCell?.figure?.color === Colors.BLACK
                            ? rookLogoBlack
                            : rookLogoYellow
                    }
                    width={sizeImg}
                    height={sizeImg}
                    alt="rook"
                />
            </button>
        </>
    );

    return <ModalWindow title={title} body={body} footer={footer} />;
};

export default ModalTransformPawn;

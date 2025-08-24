import { FC } from "react";
import bishopLogoBlack from "../assets/images/min-black-bishop.png";
import knightLogoBlack from "../assets/images/min-black-knight.png";
import queenLogoBlack from "../assets/images/min-black-queen.png";
import rookLogoBlack from "../assets/images/min-black-rook.png";
import bishopLogoYellow from "../assets/images/min-yellow-bishop.png";
import knightLogoYellow from "../assets/images/min-yellow-knight.png";
import queenLogoYellow from "../assets/images/min-yellow-queen.png";
import rookLogoYellow from "../assets/images/min-yellow-rook.png";
import { useAppSelector } from "../hook";
import { Cell } from "../models/Cell";
import { Bishop } from "../models/figures/Bishop";
import { FigureNames } from "../models/figures/Figure";
import { Knight } from "../models/figures/Knight";
import { Queen } from "../models/figures/Queen";
import { Rook } from "../models/figures/Rook";
import { Colors } from "../types";
import ModalWindow from "./ModalWindow";

interface ModalTransformPawnProps {
    updateBoard: () => void;
}

const ModalTransformPawn: FC<ModalTransformPawnProps> = (props) => {
    const { updateBoard } = props;
    const sizeImg = 36;
    const gameState = useAppSelector((state) => state.chess);

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
        if (gameState.advancedPawnCell && color) {
            pawnTransformation(figure, gameState.advancedPawnCell, color);
            gameState.advancedPawnCell = null;
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
                    handleAdvancedPawn(FigureNames.QUEEN, gameState.advancedPawnCell?.figure?.color)
                }
            >
                <img
                    src={
                        gameState.advancedPawnCell?.figure?.color === Colors.BLACK
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
                    handleAdvancedPawn(
                        FigureNames.KNIGHT,
                        gameState.advancedPawnCell?.figure?.color
                    )
                }
            >
                <img
                    src={
                        gameState.advancedPawnCell?.figure?.color === Colors.BLACK
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
                    handleAdvancedPawn(
                        FigureNames.BISHOP,
                        gameState.advancedPawnCell?.figure?.color
                    )
                }
            >
                <img
                    src={
                        gameState.advancedPawnCell?.figure?.color === Colors.BLACK
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
                    handleAdvancedPawn(FigureNames.ROOK, gameState.advancedPawnCell?.figure?.color)
                }
            >
                <img
                    src={
                        gameState.advancedPawnCell?.figure?.color === Colors.BLACK
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

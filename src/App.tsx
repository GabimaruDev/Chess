import { useEffect, useMemo } from "react";
import BoardComponent from "./components/BoardComponent";
import LostFigures from "./components/LostFigures";
import Timer from "./components/Timer";
import { useAppDispatch, useAppSelector } from "./hook";
import { Player } from "./models/Player";
import { setGameStatus } from "./store/slices";
import { Colors } from "./types";

function App() {
    const dispatch = useAppDispatch();
    const gameState = useAppSelector((state) => state.chess);
    const whitePlayer = useMemo(() => new Player(Colors.WHITE), []);
    const blackPlayer = useMemo(() => new Player(Colors.BLACK), []);

    useEffect(() => {
        const currentColor = gameState.currentPlayer.color;
        const isCheck = gameState.board.isKingInCheck(currentColor);
        const isCheckmate = gameState.board.isCheckmate(currentColor);
        const isStalemate = gameState.board.isStalemate(currentColor);

        const gameOver = isCheckmate || isStalemate;
        const winner = isCheckmate
            ? currentColor === Colors.WHITE
                ? blackPlayer
                : whitePlayer
            : null;

        dispatch(
            setGameStatus({
                isCheck,
                isCheckmate,
                isStalemate,
                gameOver,
                winner,
            })
        );
    }, [gameState.board]);

    const currentPlayerName = gameState.currentPlayer.color === Colors.BLACK ? "Чёрные" : "Белые";
    const getStatusMessage = () => {
        if (gameState.isCheckmate) {
            return `Мат! ${currentPlayerName} выиграли!`;
        } else if (gameState.isStalemate) {
            return "Пат! Ничья!";
        } else if (gameState.isCheck) {
            return `Шах! ${currentPlayerName} должен защитить короля!`;
        }
        return `Ход игрока: ${currentPlayerName}`;
    };

    return (
        <div className="app-wrapper">
            <div className="app">
                <h2 className="turn">{getStatusMessage()}</h2>
                <BoardComponent />
                <Timer />
                <div className="lost-wrapper">
                    <LostFigures title="Чёрные фигуры" figures={gameState.board.lostBlackFigures} />
                    <LostFigures title="Белые фигуры" figures={gameState.board.lostWhiteFigures} />
                </div>
            </div>
        </div>
    );
}

export default App;

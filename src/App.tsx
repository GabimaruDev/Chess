import { useCallback, useEffect, useMemo, useState } from "react";
import BoardComponent from "./components/BoardComponent";
import LostFigures from "./components/LostFigures";
import Timer from "./components/Timer";
import { useAppDispatch, useAppSelector } from "./hook";
import { Board } from "./models/Board";
import { Cell } from "./models/Cell";
import { Colors } from "./models/Colors";
import { Player } from "./models/Player";
import { setGameStatus } from "./store/slice";

function App() {
    const whitePlayer = useMemo(() => new Player(Colors.WHITE), []);
    const blackPlayer = useMemo(() => new Player(Colors.BLACK), []);
    const [currentPlayer, setCurrentPlayer] = useState<Player>(whitePlayer);
    const [board, setBoard] = useState(new Board());
    const [isStartGame, setIsStartGame] = useState(true);
    const [isTimerPaused, setIsTimerPaused] = useState(true);
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    const dispatch = useAppDispatch();
    const gameState = useAppSelector((state) => state.chess);

    const initGame = useCallback(() => {
        setIsStartGame(false);
        setIsTimerPaused(false);
    }, []);

    const restart = useCallback(() => {
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures();
        setBoard(newBoard);
        setCurrentPlayer(whitePlayer);
        setSelectedCell(null);
    }, []);

    const checkGameStatus = useCallback(() => {
        const currentColor = currentPlayer.color;
        const isCheck = board.isKingInCheck(currentColor);
        const isCheckmate = board.isCheckmate(currentColor);
        const isStalemate = board.isStalemate(currentColor);

        const gameOver = isCheckmate || isStalemate;
        let winner = null;

        if (isCheckmate) {
            winner =
                currentColor === Colors.WHITE ? { color: Colors.BLACK } : { color: Colors.WHITE };
        }

        dispatch(
            setGameStatus({
                gameOver,
                winner,
                isCheck,
                isCheckmate,
                isStalemate,
            })
        );
    }, [currentPlayer, board]);

    const swapPlayer = () => {
        setCurrentPlayer(currentPlayer.color === Colors.WHITE ? blackPlayer : whitePlayer);
    };

    useEffect(() => {
        checkGameStatus();
    }, [board]);

    useEffect(() => {
        setIsTimerPaused(
            isStartGame ||
                !!board.advancedPawnCell ||
                gameState.isCheckmate ||
                gameState.isStalemate
        );
    }, [isStartGame, board.advancedPawnCell, gameState.isCheckmate, gameState.isStalemate]);

    useEffect(() => {
        restart();
    }, []);

    const currentPlayerName = currentPlayer.color === Colors.BLACK ? "Чёрные" : "Белые";
    const getStatusMessage = () => {
        if (gameState.isCheckmate) {
            return `Мат! ${
                gameState.winner?.color === Colors.BLACK ? "Чёрные" : "Белые"
            } выиграли!`;
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
                <BoardComponent
                    board={board}
                    setBoard={setBoard}
                    currentPlayer={currentPlayer}
                    swapPlayer={swapPlayer}
                    selectedCell={selectedCell}
                    setSelectedCell={setSelectedCell}
                />
                <Timer
                    restart={restart}
                    currentPlayer={currentPlayer}
                    isPaused={isTimerPaused}
                    initGame={initGame}
                    isStartGame={isStartGame}
                />
                <div className="lost-wrapper">
                    <LostFigures title="Чёрные фигуры" figures={board.lostBlackFigures} />
                    <LostFigures title="Белые фигуры" figures={board.lostWhiteFigures} />
                </div>
            </div>
        </div>
    );
}

export default App;

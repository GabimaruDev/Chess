import { useCallback, useEffect, useMemo, useState } from "react";
import BoardComponent from "./components/BoardComponent";
import LostFigures from "./components/LostFigures";
import Timer from "./components/Timer";
import { Board } from "./models/Board";
import { Cell } from "./models/Cell";
import { Colors } from "./models/Colors";
import { Player } from "./models/Player";
import { GameState } from "./types";

function App() {
    const [gameState, setGameState] = useState<GameState>({
        board: new Board(),
        currentPlayer: new Player(Colors.WHITE),
        selectedCell: null,
        gameOver: false,
        winner: null,
        isCheck: false,
        isCheckmate: false,
        isStalemate: false,
    });
    const [isStartGame, setIsStartGame] = useState(true);
    const [isTimerPaused, setIsTimerPaused] = useState(true);
    const whitePlayer = useMemo(() => new Player(Colors.WHITE), []);
    const blackPlayer = useMemo(() => new Player(Colors.BLACK), []);

    const initGame = useCallback(() => {
        setIsStartGame(false);
        setIsTimerPaused(false);
    }, []);

    const restart = useCallback(() => {
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures();
        setGameState({
            board: newBoard,
            currentPlayer: whitePlayer,
            selectedCell: null,
            gameOver: false,
            winner: null,
            isCheck: false,
            isCheckmate: false,
            isStalemate: false,
        });
        setIsStartGame(true);
        setIsTimerPaused(true);
    }, []);

    const setSelectedCell = useCallback((cell: Cell | null) => {
        setGameState((prev) => ({
            ...prev,
            selectedCell: cell,
        }));
    }, []);

    const setBoard = useCallback((board: Board) => {
        setGameState((prev) => ({
            ...prev,
            board,
        }));
    }, []);

    const swapPlayer = useCallback(() => {
        setGameState((prev) => ({
            ...prev,
            currentPlayer: prev.currentPlayer.color === Colors.WHITE ? blackPlayer : whitePlayer,
        }));
    }, [whitePlayer, blackPlayer]);

    const checkGameStatus = useCallback(() => {
        setGameState((prev) => {
            const currentColor = prev.currentPlayer.color;
            const isCheck = prev.board.isKingInCheck(currentColor);
            const isCheckmate = prev.board.isCheckmate(currentColor);
            const isStalemate = prev.board.isStalemate(currentColor);

            const gameOver = isCheckmate || isStalemate;
            let winner = null;

            if (isCheckmate) {
                winner = currentColor === Colors.WHITE ? blackPlayer : whitePlayer;
            }

            return {
                ...prev,
                isCheck,
                isCheckmate,
                isStalemate,
                gameOver,
                winner,
            };
        });
    }, [whitePlayer, blackPlayer]);

    useEffect(() => {
        checkGameStatus();
    }, [gameState.board, checkGameStatus]);

    useEffect(() => {
        setIsTimerPaused(
            !!gameState.board.advancedPawnCell || gameState.isCheckmate || gameState.isStalemate
        );
    }, [gameState.board.advancedPawnCell, gameState.isCheckmate, gameState.isStalemate]);

    useEffect(() => {
        restart();
    }, [restart]);

    const currentPlayerName = gameState.currentPlayer.color === Colors.BLACK ? "Чёрные" : "Белые";
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
                    board={gameState.board}
                    setBoard={setBoard}
                    currentPlayer={gameState.currentPlayer}
                    swapPlayer={swapPlayer}
                    selectedCell={gameState.selectedCell}
                    setSelectedCell={setSelectedCell}
                />
                <Timer
                    restart={restart}
                    currentPlayer={gameState.currentPlayer}
                    isPaused={isTimerPaused}
                    isCheckmate={gameState.isCheckmate}
                    isStalemate={gameState.isStalemate}
                    winner={gameState.winner}
                    initGame={initGame}
                    isStartGame={isStartGame}
                />
                <div className="lost-wrapper">
                    <LostFigures title="Чёрные фигуры" figures={gameState.board.lostBlackFigures} />
                    <LostFigures title="Белые фигуры" figures={gameState.board.lostWhiteFigures} />
                </div>
            </div>
        </div>
    );
}

export default App;

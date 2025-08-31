import { useCallback, useEffect, useMemo, useState } from "react";
import BoardComponent from "./components/BoardComponent";
import StatusText from "./components/StatusText";
import Timer from "./components/Timer";
import { useAppDispatch } from "./hook";
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
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    const dispatch = useAppDispatch();

    const initGame = useCallback(() => {
        setIsStartGame(false);
    }, []);

    const restart = useCallback(() => {
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures();
        setBoard(newBoard);
        setCurrentPlayer(whitePlayer);
        setSelectedCell(null);
        setIsStartGame(true);
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
    }, [checkGameStatus]);

    useEffect(() => {
        restart();
    }, []);

    return (
        <div className="app-wrapper">
            <div className="app">
                <StatusText currentPlayer={currentPlayer} />
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
                    initGame={initGame}
                    isStartGame={isStartGame}
                    hasAdvancedPawn={!!board.advancedPawnCell}
                    figuresArray={[board.lostBlackFigures, board.lostWhiteFigures]}
                />
            </div>
        </div>
    );
}

export default App;

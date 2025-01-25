import { useCallback, useEffect, useMemo, useState } from "react";
import { Board } from "./models/Board";
import BoardComponent from "./components/BoardComponent";
import { Player } from "./models/Player";
import { Colors } from "./models/Colors";
import LostFigures from "./components/LostFigures";
import Timer from "./components/Timer";

function App() {
    const [board, setBoard] = useState(new Board());
    const whitePlayer = useMemo(() => new Player(Colors.WHITE), []);
    const blackPlayer = useMemo(() => new Player(Colors.BLACK), []);
    const [currentPlayer, setCurrentPlayer] = useState<Player>(whitePlayer);

    const restart = useCallback(() => {
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures();
        setBoard(newBoard);
        setCurrentPlayer(whitePlayer);
    }, [whitePlayer])

    useEffect(() => {
        restart();
    }, [restart]);

    function swapPlayer() {
        setCurrentPlayer(currentPlayer.color === Colors.WHITE ? blackPlayer : whitePlayer);
    }

    return (
        <div className="app">
            <h2 className="turn">
                Ход игрока: {currentPlayer.color === Colors.BLACK ? "чёрный" : "белый"}
            </h2>
            <BoardComponent
                board={board}
                setBoard={setBoard}
                currentPlayer={currentPlayer}
                swapPlayer={swapPlayer}
            />
            <Timer restart={restart} currentPlayer={currentPlayer} />
            <div className="lost-wrapper">
                <LostFigures title="Чёрные фигуры" figures={board.lostBlackFigures} />
                <LostFigures title="Белые фигуры" figures={board.lostWhiteFigures} />
            </div>
        </div>
    );
}

export default App;

import { useEffect, useState } from "react";
import { Board } from "./models/Board";
import BoardComponent from "./components/BoardComponent";
import { Player } from "./models/Player";
import { Colors } from "./models/Colors";
import LostFigures from "./components/LostFigures";
import Timer from "./components/Timer";

function App() {
    const [board, setBoard] = useState(new Board());
    const whitePlayer = new Player(Colors.WHITE);
    const blackPlayer = new Player(Colors.BLACK);
    const [currentPlayer, setCurrentPlayer] = useState<Player>(whitePlayer);

    useEffect(() => {
        restart();
    }, []);

    function restart() {
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures();
        setBoard(newBoard);
        setCurrentPlayer(whitePlayer);
    }

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

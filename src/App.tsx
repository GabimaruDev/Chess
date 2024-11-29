import { useEffect, useState } from "react";
import { Board } from "./models/Board";
import BoardComponent from "./components/BoardComponent";
import { Player } from "./models/Player";
import { Colors } from "./models/Colors";
import LostFigures from "./components/LostFigures";

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
        setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer);
    }

    return (
        <div className="app">
            <LostFigures title="Чёрные фигуры" figures={board.lostBlackFigures} />
            <div className="board-wrapper">
                <h2>Ход игрока: {currentPlayer?.color == "black" ? "чёрный" : "белый"}</h2>
                <BoardComponent
                    board={board}
                    setBoard={setBoard}
                    currentPlayer={currentPlayer}
                    swapPlayer={swapPlayer}
                />
            </div>
            <LostFigures title="Белые фигуры" figures={board.lostWhiteFigures} />
        </div>
    );
}

export default App;

import { useEffect, useState } from "react";
import { Board } from "./models/Board";
import BoardComponent from "./components/BoardComponent";

function App() {
    const [board, setBoard] = useState(new Board());

    useEffect(() => {
        restart();
    }, []);

    function restart() {
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures();
        setBoard(newBoard);
    }

    return (
        <div className="app">
            <BoardComponent board={board} setBoard={setBoard} />
        </div>
    );
}

export default App;

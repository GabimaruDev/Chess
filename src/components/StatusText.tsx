import { FC, useMemo } from "react";
import { useAppSelector } from "../hook";
import { Colors } from "../models/Colors";
import { Player } from "../models/Player";

interface StatusTextProps {
    currentPlayer: Player;
}

const StatusText: FC<StatusTextProps> = (props) => {
    const { currentPlayer } = props;
    const gameState = useAppSelector((state) => state.chess);

    const text = useMemo(() => {
        const currentPlayerName = currentPlayer.color === Colors.BLACK ? "Чёрные" : "Белые";
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
    }, [
        currentPlayer.color,
        gameState.isCheck,
        gameState.isCheckmate,
        gameState.isStalemate,
        gameState.winner?.color,
    ]);

    return <h2 className="turn">{text}</h2>;
};

export default StatusText;

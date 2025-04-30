import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Colors } from "../models/Colors";
import { Player } from "../models/Player";
import ModalWindow from "./ModalWindow";

interface TimerProps {
    currentPlayer: Player;
    restart: () => void;
}

const Timer: FC<TimerProps> = (props) => {
    const { currentPlayer, restart } = props;

    const [blackTime, setBlackTime] = useState(300);
    const [whiteTime, setWhiteTime] = useState(300);
    const timer = useRef<null | ReturnType<typeof setInterval>>(null);

    const startTimer = useCallback(() => {
        if (timer.current) {
            clearInterval(timer.current);
        }

        const callback =
            currentPlayer?.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer;

        timer.current = setInterval(callback, 100);
    }, [currentPlayer?.color]);

    useEffect(() => {
        startTimer();
    }, [currentPlayer]);

    function decrementBlackTimer() {
        setBlackTime((prev) => {
            return prev > 0 ? prev - 0.1 : 0;
        });
    }

    function decrementWhiteTimer() {
        setWhiteTime((prev) => {
            return prev > 0 ? prev - 0.1 : 0;
        });
    }

    function handleRestart() {
        setBlackTime(300);
        setWhiteTime(300);
        restart();
    }

    const title = blackTime > whiteTime ? "Чёрные выйграли!" : "Белые выйграли!";
    const body = "Cыграете ещё одну игру?";
    const footer = (
        <button className="btn" onClick={handleRestart}>
            Новая игра
        </button>
    );

    return (
        <div className="timer">
            <div className="timer__time">
                <h2>Чёрные - {blackTime.toFixed(1)}</h2>
                <h2>{whiteTime.toFixed(1)} - Белые</h2>
            </div>
            <div>
                <button className="btn" onClick={handleRestart}>
                    Новая игра
                </button>
            </div>
            {blackTime < 0.1 || whiteTime < 0.1 ? (
                <ModalWindow title={title} body={body} footer={footer} />
            ) : (
                ""
            )}
        </div>
    );
};

export default Timer;

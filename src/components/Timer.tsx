import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../hook";
import { Colors } from "../models/Colors";
import { TimerProps } from "../types";
import ModalWindow from "./ModalWindow";

const Timer: FC<TimerProps> = (props) => {
    const { currentPlayer, restart, isPaused, isStartGame, initGame } = props;
    const [blackTime, setBlackTime] = useState(300);
    const [whiteTime, setWhiteTime] = useState(300);
    const timer = useRef<null | ReturnType<typeof setInterval>>(null);
    const gameState = useAppSelector((state) => state.chess);

    const stopTimer = useCallback(() => {
        if (timer.current) {
            clearInterval(timer.current);
            timer.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        if (timer.current) {
            clearInterval(timer.current);
        }

        if (isPaused) {
            return;
        }

        timer.current = setInterval(
            currentPlayer?.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer,
            100
        );
    }, [currentPlayer?.color, isPaused]);

    useEffect(() => {
        if (isPaused) {
            stopTimer();
        } else {
            startTimer();
        }
    }, [currentPlayer, startTimer, isPaused, stopTimer]);

    const decrementBlackTimer = () => {
        setBlackTime((prev) => {
            return prev > 0 ? prev - 0.1 : 0;
        });
    };

    const decrementWhiteTimer = () => {
        setWhiteTime((prev) => {
            return prev > 0 ? prev - 0.1 : 0;
        });
    };

    const formatTime = (seconds: number): string => {
        const totalSeconds = Math.floor(seconds);
        const tenths = Math.round((seconds % 1) * 10);
        const minutes = Number(String(Math.floor(totalSeconds / 60)).padStart(1, "0"));
        const remainingSeconds = String(totalSeconds % 60).padStart(2, "0");
        return minutes == 0
            ? `${totalSeconds}.${tenths == 10 ? 0 : String(tenths)}`
            : minutes == -1
            ? "0.0"
            : `${minutes}:${remainingSeconds}`;
    };

    const setTime = (time: number) => {
        setBlackTime(time);
        setWhiteTime(time);
    };

    const handleRestart = () => {
        setTime(600);
        restart();
    };

    const renderModal = (title: string, body: string, footer: JSX.Element) => (
        <ModalWindow title={title} body={body} footer={footer} />
    );

    return (
        <div className="timer">
            <div className="timer__time">
                <h2>
                    Белые -{" "}
                    <span className={whiteTime < 15 && whiteTime > 0.01 ? "timer__low-time" : ""}>
                        {formatTime(whiteTime)}
                    </span>
                </h2>
                <h2>
                    <span className={blackTime < 15 && blackTime > 0.01 ? "timer__low-time" : ""}>
                        {formatTime(blackTime)}
                    </span>{" "}
                    - Чёрные
                </h2>
            </div>
            <div>
                <button className="btn" onClick={handleRestart}>
                    Новая игра
                </button>
            </div>
            {gameState.isCheckmate &&
                renderModal(
                    `Мат! ${
                        gameState.winner?.color === Colors.BLACK ? "Чёрные" : "Белые"
                    } выиграли!`,
                    "Сыграете ещё одну игру?",
                    <button className="btn" onClick={handleRestart}>
                        Новая игра
                    </button>
                )}
            {gameState.isStalemate &&
                renderModal(
                    "Пат! Ничья!",
                    "Сыграете ещё одну игру?",
                    <button className="btn" onClick={handleRestart}>
                        Новая игра
                    </button>
                )}
            {(blackTime < 0.01 || whiteTime < 0.01) &&
                renderModal(
                    `Время ${blackTime < 0.01 ? "чёрных" : "белых"} вышло!`,
                    "Сыграете ещё одну игру?",
                    <button className="btn" onClick={handleRestart}>
                        Новая игра
                    </button>
                )}
            {isStartGame &&
                renderModal(
                    "Классические шахматы",
                    `Нажмите на кнопку, если готовы начать играть`,
                    <button
                        className="btn"
                        onClick={() => {
                            initGame();
                            setTime(600);
                        }}
                    >
                        Играть
                    </button>
                )}
        </div>
    );
};

export default Timer;

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

    const renderModal = (title: string, body: string, footer: JSX.Element) => (
        <ModalWindow title={title} body={body} footer={footer} />
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
            {(blackTime < 0.1 || whiteTime < 0.1) &&
                !gameState.isCheckmate &&
                !gameState.isStalemate &&
                renderModal(
                    "Время вышло!",
                    "Сыграете ещё одну игру?",
                    <button className="btn" onClick={handleRestart}>
                        Новая игра
                    </button>
                )}
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
            {isStartGame &&
                renderModal(
                    "Классические шахматы",
                    "Нажмите на кнопку, если готовы начать играть",
                    <button
                        className="btn"
                        onClick={() => {
                            initGame();
                            setBlackTime(300);
                            setWhiteTime(300);
                        }}
                    >
                        Играть
                    </button>
                )}
        </div>
    );
};

export default Timer;

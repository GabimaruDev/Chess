import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Colors } from "../models/Colors";
import { TimerProps } from "../types";
import ModalWindow from "./ModalWindow";

const Timer: FC<TimerProps> = (props) => {
    const {
        currentPlayer,
        restart,
        isPaused,
        isCheckmate,
        isStalemate,
        winner,
        isStartGame,
        initGame,
    } = props;

    const [blackTime, setBlackTime] = useState(300);
    const [whiteTime, setWhiteTime] = useState(300);
    const timer = useRef<null | ReturnType<typeof setInterval>>(null);

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

    const timeUpTitle = blackTime > whiteTime ? "Чёрные выйграли!" : "Белые выйграли!";
    const timeUpBody = "Cыграете ещё одну игру?";
    const timeUpFooter = (
        <button className="btn" onClick={handleRestart}>
            Новая игра
        </button>
    );

    const checkmateTitle = `Мат! ${winner?.color === Colors.BLACK ? "Чёрные" : "Белые"} выиграли!`;
    const checkmateBody = "Сыграете ещё одну игру?";
    const checkmateFooter = (
        <button className="btn" onClick={handleRestart}>
            Новая игра
        </button>
    );

    const stalemateTitle = "Пат! Ничья!";
    const stalemateBody = "Сыграете ещё одну игру?";
    const stalemateFooter = (
        <button className="btn" onClick={handleRestart}>
            Новая игра
        </button>
    );

    const startTitle = "Классические шахматы";
    const startBody = "Нажмите на кнопку, если готовы начать играть";
    const startFooter = (
        <button
            className="btn"
            onClick={function () {
                initGame();
                setBlackTime(300);
                setWhiteTime(300);
            }}
        >
            Играть
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
            {(blackTime < 0.1 || whiteTime < 0.1) && !isCheckmate && !isStalemate && (
                <ModalWindow title={timeUpTitle} body={timeUpBody} footer={timeUpFooter} />
            )}
            {isCheckmate && (
                <ModalWindow title={checkmateTitle} body={checkmateBody} footer={checkmateFooter} />
            )}
            {isStalemate && (
                <ModalWindow title={stalemateTitle} body={stalemateBody} footer={stalemateFooter} />
            )}
            {isStartGame && (
                <ModalWindow title={startTitle} body={startBody} footer={startFooter} />
            )}
        </div>
    );
};

export default Timer;

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hook";
import { Board } from "../models/Board";
import { Colors } from "../models/Colors";
import { Player } from "../models/Player";
import { setBoard, swapPlayer } from "../store/slices";
import ModalWindow from "./ModalWindow";

const Timer = () => {
    const gameState = useAppSelector((state) => state.chess);
    const dispatch = useAppDispatch();
    const [isStartGame, setIsStartGame] = useState(true);
    const [isTimerPaused, setIsTimerPaused] = useState(true);
    const [blackTime, setBlackTime] = useState(300);
    const [whiteTime, setWhiteTime] = useState(300);
    const timer = useRef<null | ReturnType<typeof setInterval>>(null);

    const startGame = useCallback(() => {
        setIsStartGame(false);
        setIsTimerPaused(false);
    }, []);

    const restart = useCallback(() => {
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures();
        dispatch(setBoard(newBoard));
        setIsStartGame(true);
        setIsTimerPaused(true);
        if (gameState.currentPlayer.color === Colors.BLACK) {
            dispatch(swapPlayer(new Player(Colors.WHITE)));
        }
    }, []);

    useEffect(() => {
        restart();
    }, []);

    useEffect(() => {
        if (
            gameState.isCheckmate ||
            gameState.isStalemate ||
            gameState.advancedPawnCell ||
            isStartGame
        )
            setIsTimerPaused(true);
        else {
            setIsTimerPaused(false);
        }
    }, [gameState.isCheckmate, gameState.isStalemate, gameState.advancedPawnCell, isStartGame]);

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
        if (isTimerPaused) {
            return;
        }

        timer.current = setInterval(
            gameState.currentPlayer?.color === Colors.WHITE
                ? decrementWhiteTimer
                : decrementBlackTimer,
            100
        );
    }, [gameState.currentPlayer?.color, isTimerPaused]);

    useEffect(() => {
        if (isTimerPaused) {
            stopTimer();
        } else {
            startTimer();
        }
    }, [gameState.currentPlayer, startTimer, isTimerPaused, stopTimer]);

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

    const checkmateTitle = `Мат! ${
        gameState.winner?.color === Colors.BLACK ? "Чёрные" : "Белые"
    } выиграли!`;
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
                startGame();
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
            {(blackTime < 0.1 || whiteTime < 0.1) &&
                !gameState.isCheckmate &&
                !gameState.isStalemate && (
                    <ModalWindow title={timeUpTitle} body={timeUpBody} footer={timeUpFooter} />
                )}
            {gameState.isCheckmate && (
                <ModalWindow title={checkmateTitle} body={checkmateBody} footer={checkmateFooter} />
            )}
            {gameState.isStalemate && (
                <ModalWindow title={stalemateTitle} body={stalemateBody} footer={stalemateFooter} />
            )}
            {isStartGame && (
                <ModalWindow title={startTitle} body={startBody} footer={startFooter} />
            )}
        </div>
    );
};

export default Timer;

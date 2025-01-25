import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Player } from "../models/Player";
import { Colors } from "../models/Colors";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";

interface TimerProps {
    currentPlayer: Player;
    restart: () => void;
}

const Timer: FC<TimerProps> = ({ currentPlayer, restart }) => {
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
    }, [currentPlayer?.color])

    useEffect(() => {
        startTimer();
    }, [currentPlayer, startTimer]);

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

    const handleRestart = () => {
        setBlackTime(300);
        setWhiteTime(300);
        restart();
    };

    return blackTime && whiteTime ? (
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
        </div>
    ) : (
        <>
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
            </div>
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>
                        <b>{blackTime > whiteTime ? "Чёрные выйграли!" : "Белые выйграли!"}</b>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Cыграете ещё одну игру?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={handleRestart}>Новая игра</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </>
    );
};

export default Timer;

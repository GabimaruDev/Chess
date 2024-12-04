import { FC, useEffect, useRef, useState } from "react";
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

    useEffect(() => {
        startTimer();
    }, [currentPlayer]);

    function startTimer() {
        if (timer.current) {
            clearInterval(timer.current);
        }

        const callback =
            currentPlayer?.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer;

        timer.current = setInterval(callback, 100);
    }

    function decrementBlackTimer() {
        setBlackTime((prev) => {
            return Number(prev > 0 ? (prev - 0.1).toFixed(1) : 0)
        });
    }

    function decrementWhiteTimer() {
        setWhiteTime((prev) => {
            return Number(prev > 0 ? (prev - 0.1).toFixed(1) : 0)
        });
    }

    const handleRestart = () => {
        setBlackTime(300);
        setWhiteTime(300);
        restart();
    };

    return blackTime && whiteTime ? (
        <div>
            <div className="timer">
                <div className="timer__time">
                    <h2>Чёрные - {blackTime}</h2>
                    <h2>Белые - {whiteTime}</h2>
                </div>
                <div>
                    <button className="btn" onClick={handleRestart}>
                        Новая игра
                    </button>
                </div>
            </div>
        </div>
    ) : (
        <div>
            <div className="timer">
                <div className="timer__time">
                    <h2>Чёрные - {blackTime}</h2>
                    <h2>Белые - {whiteTime}</h2>
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
                        <b>{blackTime > whiteTime ? "Белые проиграли!" : "Чёрные проиграли!"}</b>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Cыграете ещё одну игру?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={handleRestart}>Новая игра</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    );
};

export default Timer;

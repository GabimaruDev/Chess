import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Player } from "../models/Player";
import { Colors } from "../models/Colors";
import { Button, Modal } from "react-bootstrap";

interface TimerProps {
    currentPlayer: Player;
    restart: () => void;
}

const Timer: FC<TimerProps> = ({ currentPlayer, restart }) => {
    const [blackTime, setBlackTime] = useState<any>(300);
    const [whiteTime, setWhiteTime] = useState<any>(300);
const Timer: FC<TimerProps> = (props) => {
    const { currentPlayer, restart } = props;
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
        setBlackTime((prev: number) => {
            return (prev > 0 ? prev - 0.1 : 0).toFixed(1);
        });
    }

    function decrementWhiteTimer() {
        setWhiteTime((prev: number) => {
            return (prev > 0 ? prev - 0.1 : 0).toFixed(1);
        });
    }

    function handleRestart() {
        setBlackTime(300);
        setWhiteTime(300);
        restart();
    }

    return blackTime > 0.1 && whiteTime > 0.1 ? (
        <div className="timer">
            <div className="timer__time">
                <h2>Чёрные - {blackTime}</h2>
                <h2>{whiteTime} - Белые</h2>
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
                    <h2>Чёрные - {blackTime}</h2>
                    <h2>{whiteTime} - Белые</h2>
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

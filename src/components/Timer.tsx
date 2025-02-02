import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Player } from "../models/Player";
import { Colors } from "../models/Colors";
import { Button, Modal } from "react-bootstrap";

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

    return (
        <div className="timer">
            <div className="timer__time">
                <h2>Чёрные - {blackTime.toFixed(1)}</h2>
                <h2>{whiteTime.toFixed(1)} - Белые</h2>
            </div>
            <div>
                <button className="button" onClick={handleRestart}>
                    Новая игра
                </button>
            </div>
            {blackTime < 0.1 || whiteTime < 0.1 ? (
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
                        <Button className="button" onClick={handleRestart}>
                            Новая игра
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            ) : (
                ""
            )}
        </div>
    );
};

export default Timer;

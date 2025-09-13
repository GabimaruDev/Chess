import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../hook";
import { Colors } from "../models/Colors";
import { GameInfoProps } from "../types";
import GameModals from "./GameModals";
import LostFigures from "./LostFigures";

const GameInfo: FC<GameInfoProps> = (props) => {
  const { currentPlayer, restart, isStartGame, initGame, hasAdvancedPawn, figuresArray } = props;
  const [blackTime, setBlackTime] = useState(600);
  const [whiteTime, setWhiteTime] = useState(600);
  const whiteTimeRef = useRef<number>(600);
  const blackTimeRef = useRef<number>(600);
  const timer = useRef<null | number>(null);
  const gameState = useAppSelector((state) => state.chess);

  const isTimerPaused =
    isStartGame || hasAdvancedPawn || gameState.isCheckmate || gameState.isStalemate;

  const stopTimer = useCallback(() => {
    if (timer.current !== null) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const updateTime = useCallback((time: number, isWhite: boolean) => {
    const displayTime = time < 60 ? Math.max(0, time) : Math.max(0, Math.floor(time));

    if (isWhite) {
      setWhiteTime((prev) => (prev !== displayTime ? displayTime : prev));
    } else {
      setBlackTime((prev) => (prev !== displayTime ? displayTime : prev));
    }
  }, []);

  const tick = useCallback(() => {
    const isWhiteTurn = currentPlayer?.color === Colors.WHITE;

    if (isWhiteTurn) {
      const next = (whiteTimeRef.current -= 0.1);
      updateTime(next, true);
      if (next <= 0) {
        whiteTimeRef.current = 0;
        stopTimer();
      }
    } else {
      const next = (blackTimeRef.current -= 0.1);
      updateTime(next, false);
      if (next <= 0) {
        blackTimeRef.current = 0;
        stopTimer();
      }
    }
  }, [currentPlayer?.color]);

  const startTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }

    if (isTimerPaused) {
      return;
    }

    timer.current = setInterval(tick, 100);
  }, [isTimerPaused]);

  useEffect(() => {
    if (isTimerPaused) {
      stopTimer();
    } else {
      startTimer();
    }
  }, [isTimerPaused]);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  const formatTime = (seconds: number): string => {
    const totalSeconds = Math.floor(seconds);
    const tenths = Math.round((seconds % 1) * 10);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    if (seconds < 60) {
      return `${totalSeconds}.${tenths === 10 ? 0 : tenths}`;
    }

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const resetTime = (time: number = 600) => {
    whiteTimeRef.current = time;
    blackTimeRef.current = time;
    setBlackTime(time);
    setWhiteTime(time);
  };

  const handleRestart = () => {
    resetTime();
    restart();
  };

  const handleStart = () => {
    initGame();
    resetTime();
  };

  return (
    <div className="gameInfo">
      <div className="timer">
        <div className="timer__lost">
          <h2>
            Белые -{" "}
            <span className={whiteTime < 15 && whiteTime != 0 ? "timer__low-time" : ""}>
              {formatTime(whiteTime)}
            </span>
          </h2>
          {figuresArray[0][0] && <LostFigures figures={figuresArray[0]} />}
        </div>
        <div className="timer__lost">
          <h2>
            <span className={blackTime < 15 && blackTime != 0 ? "timer__low-time" : ""}>
              {formatTime(blackTime)}
            </span>{" "}
            - Чёрные
          </h2>
          {figuresArray[1][0] && <LostFigures figures={figuresArray[1]} />}
        </div>
      </div>
      <button className="btn" onClick={handleRestart}>
        Новая игра
      </button>
      <GameModals
        isStartGame={isStartGame}
        onStart={handleStart}
        onRestart={handleRestart}
        isBlackTimeOver={blackTime === 0}
        isWhiteTimeOver={whiteTime === 0}
      />
    </div>
  );
};

export default GameInfo;

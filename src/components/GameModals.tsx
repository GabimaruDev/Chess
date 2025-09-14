import { FC } from "react";
import { useAppSelector } from "../hook";
import { Colors } from "../models/Colors";
import ModalWindow from "./ModalWindow";

interface GameModalsProps {
  isStartGame: boolean;
  handleStart: () => void;
  handleRestart: () => void;
  isBlackTimeOver: boolean;
  isWhiteTimeOver: boolean;
}

const GameModals: FC<GameModalsProps> = (props) => {
  const { isStartGame, handleStart, handleRestart, isBlackTimeOver, isWhiteTimeOver } = props;
  const gameState = useAppSelector((state) => state.chess);

  return (
    <>
      {gameState.isCheckmate && (
        <ModalWindow
          title={`Мат! ${gameState.winner?.color === Colors.BLACK ? "Чёрные" : "Белые"} выиграли!`}
          body="Сыграете ещё одну игру?"
          footer={
            <button className="btn" onClick={handleRestart}>
              Новая игра
            </button>
          }
        />
      )}
      {gameState.isStalemate && (
        <ModalWindow
          title="Пат! Ничья!"
          body="Сыграете ещё одну игру?"
          footer={
            <button className="btn" onClick={handleRestart}>
              Новая игра
            </button>
          }
        />
      )}
      {(isBlackTimeOver || isWhiteTimeOver) && (
        <ModalWindow
          title={`Время ${isBlackTimeOver ? "чёрных" : "белых"} вышло!`}
          body="Сыграете ещё одну игру?"
          footer={
            <button className="btn" onClick={handleRestart}>
              Новая игра
            </button>
          }
        />
      )}
      {isStartGame && (
        <ModalWindow
          title="Классические шахматы"
          body={`Нажмите на кнопку, если готовы начать играть`}
          footer={
            <button className="btn" onClick={handleStart}>
              Играть
            </button>
          }
        />
      )}
    </>
  );
};

export default GameModals;

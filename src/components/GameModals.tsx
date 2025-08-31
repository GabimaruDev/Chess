import { FC } from "react";
import { useAppSelector } from "../hook";
import { Colors } from "../models/Colors";
import ModalWindow from "./ModalWindow";

interface GameModalsProps {
  isStartGame: boolean;
  onStart: () => void;
  onRestart: () => void;
  isBlackTimeOver: boolean;
  isWhiteTimeOver: boolean;
}

const GameModals: FC<GameModalsProps> = (props) => {
  const { isStartGame, onStart, onRestart, isBlackTimeOver, isWhiteTimeOver } = props;
  const gameState = useAppSelector((state) => state.chess);

  return (
    <>
      {gameState.isCheckmate && (
        <ModalWindow
          title={`Мат! ${gameState.winner?.color === Colors.BLACK ? "Чёрные" : "Белые"} выиграли!`}
          body="Сыграете ещё одну игру?"
          footer={
            <button className="btn" onClick={onRestart}>
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
            <button className="btn" onClick={onRestart}>
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
            <button className="btn" onClick={onRestart}>
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
            <button className="btn" onClick={onStart}>
              Играть
            </button>
          }
        />
      )}
    </>
  );
};

export default GameModals;

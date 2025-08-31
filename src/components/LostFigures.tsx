import { FC } from "react";
import { Figure } from "../models/figures/Figure";

interface LostFiguresProps {
  figures: Figure[];
}

const LostFigures: FC<LostFiguresProps> = (props) => {
  const { figures } = props;

  const figureOrder = ["Пешка", "Конь", "Слон", "Ладья", "Ферзь"];
  const figureCounts = new Map<string, number>();

  figures.forEach((figure) => {
    const count = figureCounts.get(figure.name) || 0;
    figureCounts.set(figure.name, count + 1);
  });

  const displayFigures = figureOrder
    .filter((name) => (figureCounts.get(name) || 0) > 0)
    .map((name) => ({
      name,
      count: figureCounts.get(name) || 0,
      logo: figures.find((f) => f.name === name)?.logo,
    }));

  return (
    <div className="lost">
      {displayFigures.map((figure) => (
        <div className="lost__description" key={figure.name}>
          {figure.logo && <img src={figure.logo} width={18} height={18} alt="" />}x{figure.count}
        </div>
      ))}
    </div>
  );
};

export default LostFigures;

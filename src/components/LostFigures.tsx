import { FC } from "react";
import { Figure } from "../models/figures/Figure";

interface LostFiguresProps {
    title: string;
    figures: Figure[];
}

const LostFigures: FC<LostFiguresProps> = (props) => {
    const { title, figures } = props;
    return (
        <div className="lost">
            <h3 className="lost__title">{title}</h3>
            {figures.map((figure) => (
                <div className="lost__description" key={figure.id}>
                    {figure.logo && <img src={figure.logo} width={18} height={18} alt="" />}{" "}
                    {figure.name}
                </div>
            ))}
        </div>
    );
};

export default LostFigures;

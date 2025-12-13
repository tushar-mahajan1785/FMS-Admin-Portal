import { ChecklistLinearProgressBar, ChecklistLinearProgressRoot } from "../common";

export const ChecklistLinearProgress = ({ id = "progress-bar", bgColor }) => {
    return (
        <ChecklistLinearProgressRoot>
            <ChecklistLinearProgressBar id={id} bgColor={bgColor} />
        </ChecklistLinearProgressRoot>);
};
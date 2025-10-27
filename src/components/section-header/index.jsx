import CircleCheckIcon from "../../assets/icons/CircleCheck";
import { SectionHeaderWrapper, SectionTitle } from "../common";
import ProgressBar from "../progress-bar";

export default function SectionHeader({ title, progress, show_progress = 1, ...rest }) {
  return (
    <SectionHeaderWrapper {...rest}>
      <SectionTitle>{title}</SectionTitle>
      {progress === 100 ? (
        <CircleCheckIcon color="success" />
      ) : <>
        {
          show_progress == 1 ?
            <ProgressBar value={progress} />
            :
            <></>
        }
      </>}
    </SectionHeaderWrapper>
  );
}

import { useTheme } from "@emotion/react";
import CircleCheckIcon from "../../assets/icons/CircleCheck";
import { SectionHeaderWrapper, SectionTitle } from "../common";
import ProgressBar from "../progress-bar";

export default function SectionHeader({ title, progress, show_progress = 1, ...rest }) {
  const theme = useTheme()
  return (
    <SectionHeaderWrapper {...rest}>
      <SectionTitle>{title}</SectionTitle>
      {progress === 100 ? (
        <CircleCheckIcon stroke={theme.palette.primary[600]} />
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

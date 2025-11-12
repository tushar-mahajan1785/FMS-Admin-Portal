import SvgIcon from "@mui/material/SvgIcon";

const ActivePMIcon = (props) => {
  const { stroke = "#6941C6", size = 20, ...rest } = props;

  return (
    <SvgIcon
      {...rest}
      viewBox="0 0 20 20"
      fill="none"
      style={{ fontSize: size, color: "transparent" }}
    >
      <path
        d="M0.75 8.75H4.75L7.75 16.75L11.75 0.75L14.75 8.75H18.75"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default ActivePMIcon;

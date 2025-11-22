import SvgIcon from "@mui/material/SvgIcon";

const PmActivityMarkAsDone = (props) => {
  const { stroke = "##039855", size = 20, ...rest } = props;

  return (
    <SvgIcon
      {...rest}
      viewBox="0 0 24 24"
      fill="none"
      style={{ fontSize: size, color: "transparent" }}
    >
      <path
        d="M9 11L12 14L20 6"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 12V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H15"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default PmActivityMarkAsDone;

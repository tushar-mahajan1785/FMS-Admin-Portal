import SvgIcon from "@mui/material/SvgIcon";

const ReportAnalyticsIcon = (props) => {
  const {
    stroke1 = "#101828",
    stroke2 = "#2F2B3D",

    size = 20,
    ...rest
  } = props;

  return (
    <SvgIcon
      {...rest}
      viewBox="0 0 24 24"
      fill="none"
      style={{ fontSize: size, color: "transparent" }}
    >
      <path
        d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
        stroke={stroke1}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="9"
        y="3"
        width="6"
        height="4"
        rx="2"
        stroke={stroke2}
        strokeOpacity="0.9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 17V12"
        stroke={stroke1}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17V16"
        stroke={stroke1}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 17V14"
        stroke={stroke2}
        strokeOpacity="0.9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default ReportAnalyticsIcon;

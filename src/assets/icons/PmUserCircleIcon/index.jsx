import SvgIcon from "@mui/material/SvgIcon";

const pmUserCircleIcon = (props) => {
  const {
    stroke1 = "#101828",
    stroke2 = "#2F2B3D",
    stroke3 = "#2F2B3D",
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
      <circle
        cx="9"
        cy="9"
        r="9"
        transform="matrix(-1 0 0 1 21 3)"
        stroke={stroke2}
        strokeOpacity="0.9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="3"
        cy="3"
        r="3"
        transform="matrix(-1 0 0 1 15 7)"
        stroke={stroke3}
        strokeOpacity="0.9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.832 18.849C17.3238 17.1575 15.7663 15.9995 14 16H10C8.23139 15.9994 6.6723 17.1604 6.16603 18.855"
        stroke={stroke1}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default pmUserCircleIcon;

import SvgIcon from "@mui/material/SvgIcon";

const PhoneCallIcon = (props) => {
  const {
    stroke1 = "#7F56D9",
    stroke2 = "#2F2B3D",
    size = 20,
    ...rest
  } = props;

  return (
    <SvgIcon
      {...rest}
      viewBox="0 0 21 20"
      fill="none"
      style={{ fontSize: size, color: "transparent" }}
    >
      <path
        d="M4.66667 3.33344H8L9.66667 7.5001L7.58333 8.7501C8.4758 10.5597 9.94039 12.0243 11.75 12.9168L13 10.8334L17.1667 12.5001V15.8334C17.1667 16.7539 16.4205 17.5001 15.5 17.5001C8.77304 17.0913 3.4088 11.7271 3 5.0001C3 4.07963 3.74619 3.33344 4.66667 3.33344"
        stroke={stroke1}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 5.83344C13.9205 5.83344 14.6667 6.57963 14.6667 7.5001"
        stroke={stroke1}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 2.50012C15.7614 2.50012 18 4.7387 18 7.50012"
        stroke={stroke2}
        strokeOpacity="0.9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default PhoneCallIcon;

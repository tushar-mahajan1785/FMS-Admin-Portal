import SvgIcon from "@mui/material/SvgIcon";

const PmEditReschedulerIcon = (props) => {
  const {
    stroke = "#101828",

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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 15.0001L20.385 6.58511C21.2051 5.76496 21.2051 4.43525 20.385 3.61511C19.5649 2.79496 18.2351 2.79496 17.415 3.61511L9 12.0001V15.0001H12Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 5L19 8"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.99976 7.07031C5.37179 7.60193 2.76837 10.8424 3.03092 14.4997C3.29346 18.157 6.33305 20.9924 9.99976 21.0003C13.4791 20.9999 16.4304 18.4448 16.9288 15.0013"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default PmEditReschedulerIcon;

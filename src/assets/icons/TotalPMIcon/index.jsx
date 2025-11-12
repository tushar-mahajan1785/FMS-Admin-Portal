import SvgIcon from "@mui/material/SvgIcon";

const TotalPMIcon = (props) => {
  const { stroke = "#6941C6", size = 24, ...rest } = props;

  return (
    <SvgIcon
      {...rest}
      viewBox={`0 0 24 24`}
      fill="none"
      style={{ fontSize: size, color: "transparent" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.5 5C18.1849 5.00162 19.7278 5.9444 20.498 7.44302C21.2682 8.94163 21.1367 10.745 20.1572 12.116C19.1777 13.487 17.5144 14.1959 15.847 13.953L11.5 16.962V17C11.5001 18.5886 10.2618 19.9018 8.676 19.995L8.5 20C7.07358 20.0001 5.84433 18.9958 5.56 17.598L3 16.5V13L6.51 14.755C7.28144 14.0678 8.35307 13.8277 9.344 14.12L12.071 10.302C11.8333 8.98935 12.1902 7.63887 13.0454 6.61507C13.9006 5.59127 15.166 4.99969 16.5 5Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="16.5"
        cy="9.5"
        r="1"
        fill={stroke}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default TotalPMIcon;

import SvgIcon from "@mui/material/SvgIcon";

const ArrowDownIcon = (props) => {
    const { stroke = "#D50000", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 24 24"
            fill="none"
            style={{ fontSize: size, color: "transparent" }}
        >
            <path d="M12 5V19" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 13L12 19" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 13L12 19" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default ArrowDownIcon;

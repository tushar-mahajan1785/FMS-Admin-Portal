import SvgIcon from "@mui/material/SvgIcon";

const ArrowRightIcon = (props) => {
    const { stroke = "#2F2B3D", size = 36, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 36 36"
            fill="none"
            style={{ fontSize: size, color: "transparent" }}
        >
            <path d="M7.5 18H28.5" stroke={stroke} strokeOpacity="0.9" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22.5 24L28.5 18" stroke={stroke} strokeOpacity="0.9" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22.5 12L28.5 18" stroke={stroke} strokeOpacity="0.9" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default ArrowRightIcon;

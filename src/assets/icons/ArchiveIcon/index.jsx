import SvgIcon from "@mui/material/SvgIcon";

const ArchiveIcon = (props) => {
    const { stroke = "#6941C6", size = 20, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 20 20"
            fill="none"
            style={{ fontSize: size, color: "transparent" }}
        >
            <rect x="2.5" y="3.33203" width="15" height="3.33333" rx="1.66667" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.16663 6.66797V15.0013C4.16663 15.9218 4.91282 16.668 5.83329 16.668H14.1666C15.0871 16.668 15.8333 15.9218 15.8333 15.0013V6.66797" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.33337 9.9987H11.6667" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default ArchiveIcon;

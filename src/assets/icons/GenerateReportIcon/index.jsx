import SvgIcon from '@mui/material/SvgIcon';

const GenerateReportIcon = (props) => {
    const { stroke = "#ffffffff", size = 18, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 18 18"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M3.75 16.7501C2.09315 16.7501 0.75 15.4069 0.75 13.7501V3.75C0.75 2.09315 2.09315 0.75 3.75 0.75H13.75C15.4069 0.75 16.75 2.09315 16.75 3.75L16.75 13.7501C16.75 15.4069 15.4069 16.7501 13.75 16.7501H3.75Z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M4.75 10.0833L9.41667 3.75V8.08333H12.75L8.08333 13.75V10.0833H4.75Z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default GenerateReportIcon;

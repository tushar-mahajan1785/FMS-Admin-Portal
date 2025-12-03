import SvgIcon from '@mui/material/SvgIcon';

const ReportsIcon = (props) => {
    const { stroke = "#101828", size = 18, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 18 18"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M6 3.75H4.5C3.67157 3.75 3 4.42157 3 5.25V14.25C3 15.0784 3.67157 15.75 4.5 15.75H8.77275" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.5 10.5V13.5H16.5" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.5 8.25V5.25C13.5 4.42157 12.8284 3.75 12 3.75H10.5" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="6" y="2.25" width="4.5" height="3" rx="1.5" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="13.5" cy="13.5" r="3" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 8.25H9" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 11.25H8.25" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default ReportsIcon;

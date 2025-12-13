import SvgIcon from '@mui/material/SvgIcon';

const CalendarStatsIcon = (props) => {
    const { stroke = "#6941C6", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 24 24"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M11.795 21H5C3.89543 21 3 20.1046 3 19V7C3 5.89543 3.89543 5 5 5H17C18.1046 5 19 5.89543 19 7V11" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 14V18H22" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="18" cy="18" r="4" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 3V7" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 3V7" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 11H19" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default CalendarStatsIcon;
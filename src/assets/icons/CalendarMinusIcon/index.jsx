import SvgIcon from '@mui/material/SvgIcon';

const CalendarMinusIcon = (props) => {
    const { stroke = "#717680", size = 20, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox={`0 0 20 20`}
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <rect x="3.33337" y="4.16797" width="13.3333" height="13.3333" rx="2" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.3333 2.5V5.83333" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.66667 2.5V5.83333" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.33337 9.16667H16.6667" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.33337 13.3346H11.6667" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default CalendarMinusIcon;

import SvgIcon from '@mui/material/SvgIcon';

const CalendarIcon = (props) => {
    const { stroke = "#2F2B3D", size = 21, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 21 21"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M10.3292 18.2127H4.66667C3.74619 18.2127 3 17.4665 3 16.5461V6.54606C3 5.62559 3.74619 4.87939 4.66667 4.87939H14.6667C15.5871 4.87939 16.3333 5.62559 16.3333 6.54606V9.87939" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="15.5" cy="15.7127" r="3.33333" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 3.21277V6.5461" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.33329 3.21277V6.5461" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 9.87944H16.3333" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.5 14.4595V15.7128L16.3333 16.5461" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default CalendarIcon;
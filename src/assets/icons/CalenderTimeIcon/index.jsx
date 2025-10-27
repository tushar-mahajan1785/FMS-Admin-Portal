import SvgIcon from '@mui/material/SvgIcon';

const CalenderTimeIcon = (props) => {
    const { stroke = "#7F56D9", size = 20, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 20 20"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M9.82917 17.5001H4.16667C3.24619 17.5001 2.5 16.754 2.5 15.8335V5.83348C2.5 4.913 3.24619 4.16681 4.16667 4.16681H14.1667C15.0871 4.16681 15.8333 4.913 15.8333 5.83348V9.16681" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="15" cy="15.0001" r="3.33333" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.5 2.50012V5.83346" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.83329 2.50012V5.83346" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.5 9.16679H15.8333" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 13.7468V15.0001L15.8333 15.8334" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default CalenderTimeIcon;

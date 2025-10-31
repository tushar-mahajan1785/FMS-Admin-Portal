import SvgIcon from '@mui/material/SvgIcon';

const CircleCheckOutlineIcon = (props) => {
    const { stroke = "#039855", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 24 24"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <rect width="24" height="24" rx="12" fill="white" />
            <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12L11 14L15 10" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default CircleCheckOutlineIcon;

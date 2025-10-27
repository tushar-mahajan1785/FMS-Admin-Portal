import SvgIcon from '@mui/material/SvgIcon';

const CircleCheckIcon = (props) => {
    const { stroke = "#7F56D9", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 24 24"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <rect y="9.15527e-05" width="24" height="24" rx="12" fill={stroke} />
            <circle cx="12" cy="12.0001" r="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12.0001L11 14.0001L15 10.0001" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default CircleCheckIcon;

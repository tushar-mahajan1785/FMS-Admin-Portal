import SvgIcon from '@mui/material/SvgIcon';

const RoleIcon = (props) => {
    const { stroke = "#181D27", size = 18, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 25 25"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <rect x="3.54297" y="4.80078" width="18" height="16" rx="3" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9.54297" cy="10.8008" r="2" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.543 8.80078H17.543" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.543 12.8008H17.543" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.54297 16.8008H17.543" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default RoleIcon;

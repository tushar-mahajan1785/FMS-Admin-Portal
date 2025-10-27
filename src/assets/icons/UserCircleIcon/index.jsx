import SvgIcon from '@mui/material/SvgIcon';

const UserCircleIcon = (props) => {
    const { stroke = "#7F56D9", size = 20, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 20 20"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <circle cx="10.5" cy="10.2871" r="7.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <ellipse cx="10.5" cy="8.62036" rx="2.5" ry="2.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.63989 15.9945C6.06342 14.5849 7.36135 13.6199 8.83323 13.6204H12.1666C13.6404 13.6199 14.9397 14.5873 15.3616 15.9995" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default UserCircleIcon;

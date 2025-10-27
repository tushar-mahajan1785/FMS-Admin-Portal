import SvgIcon from '@mui/material/SvgIcon';

const DeviceDesktopIcon = (props) => {
    const { stroke = "#7F56D9", size = 20, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 20 20"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <rect x="3" y="3.62036" width="15" height="10" rx="1" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.33325 16.9538H14.6666" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.99992 13.6204V16.9537" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.9999 13.6204V16.9537" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></SvgIcon>
    );
};

export default DeviceDesktopIcon;

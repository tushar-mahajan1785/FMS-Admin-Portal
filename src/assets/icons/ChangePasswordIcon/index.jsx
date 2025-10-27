import SvgIcon from '@mui/material/SvgIcon';

const ChangePasswordIcon = (props) => {
    const { stroke = "#181D27", size = 20, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 20 22"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M5 10V6.00003C4.99875 4.76008 5.45828 3.5639 6.28937 2.6437C7.12047 1.7235 8.26383 1.14493 9.4975 1.02032C10.7312 0.895707 11.9671 1.23393 12.9655 1.96934C13.9638 2.70475 14.6533 3.78488 14.9 5.00003M3 10H17C18.1046 10 19 10.8955 19 12V19C19 20.1046 18.1046 21 17 21H3C1.89543 21 1 20.1046 1 19V12C1 10.8955 1.89543 10 3 10Z" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default ChangePasswordIcon;

import SvgIcon from '@mui/material/SvgIcon';

const AlertCircleIcon = (props) => {
    const { stroke = "#D92D20", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 24 24"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default AlertCircleIcon;

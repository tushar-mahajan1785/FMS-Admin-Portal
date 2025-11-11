import SvgIcon from '@mui/material/SvgIcon';

const BoxPlusIcon = (props) => {
    const { stroke = "#6941C6", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 24 24"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M20 12.3088V7.5L12 3L4 7.5V16.5L12 21L14 19.875L15 19.3125" stroke={stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 12L20 7.5" stroke={stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 12V21" stroke={stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 12L4 7.5" stroke={stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16.7549 17.8008V16.0566H15C14.5858 16.0566 14.25 15.7209 14.25 15.3066C14.25 14.8924 14.5858 14.5566 15 14.5566H16.7549V12.8008C16.7549 12.3866 17.0907 12.0508 17.5049 12.0508C17.9191 12.0508 18.2549 12.3866 18.2549 12.8008V14.5566H20C20.4142 14.5566 20.75 14.8924 20.75 15.3066C20.75 15.7209 20.4142 16.0566 20 16.0566H18.2549V17.8008C18.2549 18.215 17.9191 18.5508 17.5049 18.5508C17.0907 18.5507 16.7549 18.215 16.7549 17.8008Z"
                fill={stroke}
            />
        </SvgIcon>
    );
};

export default BoxPlusIcon;

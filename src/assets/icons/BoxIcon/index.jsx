import SvgIcon from '@mui/material/SvgIcon';

const BoxIcon = (props) => {
    const { stroke = "#6941C6", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 24 24"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M20 7.5L12 3L4 7.5V16.5L12 21L20 16.1547V7.5Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 12C15.1242 10.2426 16.8758 9.25736 20 7.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 12V21" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 12L4 7.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default BoxIcon;

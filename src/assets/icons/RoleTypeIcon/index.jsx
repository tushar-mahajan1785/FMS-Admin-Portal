import SvgIcon from '@mui/material/SvgIcon';

const RoleTypeIcon = (props) => {
    const { stroke = "#181D27", size = 25, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 25 25"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M12.543 4.80078L4.54297 8.80078L12.543 12.8008L20.543 8.80078L12.543 4.80078" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.54297 12.8008L12.543 16.8008L20.543 12.8008" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.54297 16.8008L12.543 20.8008L20.543 16.8008" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default RoleTypeIcon;

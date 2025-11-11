

import SvgIcon from '@mui/material/SvgIcon';

const ActivityIcon = (props) => {
    const { stroke = "#6941C6", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 24 24"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M3 12H7L10 20L14 4L17 12H21" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default ActivityIcon;

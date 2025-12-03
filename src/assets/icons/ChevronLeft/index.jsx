import SvgIcon from '@mui/material/SvgIcon';

const ChevronLeftIcon = (props) => {
    const { stroke = "#181D27", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 24 24"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M14.4 16.8L9.59998 12L14.4 7.2" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default ChevronLeftIcon;

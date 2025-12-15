import SvgIcon from '@mui/material/SvgIcon';

const ChevronRightIcon = (props) => {
    const { stroke = "#181D27", size = 14, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 14 14"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M1 13L7 7L1 1" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default ChevronRightIcon;

import SvgIcon from '@mui/material/SvgIcon';

const CloseIcon = (props) => {
    const { stroke = "#181D27", size = 23, strokeWidth = '2', ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 22 23"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M21 1.71265L1 21.7126M1 1.71265L21 21.7126" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default CloseIcon;

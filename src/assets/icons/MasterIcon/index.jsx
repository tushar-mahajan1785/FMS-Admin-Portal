import SvgIcon from '@mui/material/SvgIcon';

const MasterIcon = (props) => {
    const { stroke = "#101828", size = 18, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 18 19"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <rect x="2.25" y="5.53735" width="13.5" height="9.75" rx="2" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 5.53735V4.03735C6 3.20893 6.67157 2.53735 7.5 2.53735H10.5C11.3284 2.53735 12 3.20893 12 4.03735V5.53735" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 9.28736V9.29486" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.25 10.0374C6.49571 12.1768 11.5043 12.1768 15.75 10.0374" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        </SvgIcon>
    );
};

export default MasterIcon;

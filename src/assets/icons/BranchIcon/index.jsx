import SvgIcon from '@mui/material/SvgIcon';

const BranchIcon = (props) => {
    const { stroke = "#2F2B3D", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 24 24"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <circle cx="7" cy="18" r="2" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="7" cy="6" r="2" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="17" cy="6" r="2" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 8V16" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 18H15C16.1046 18 17 17.1046 17 16V11" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 14L17 11L20 14" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default BranchIcon;

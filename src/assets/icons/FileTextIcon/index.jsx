import SvgIcon from '@mui/material/SvgIcon';

const FileTextIcon = (props) => {
    const { stroke1 = "#101828", stroke2 = "#2F2B3D", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox={`0 0 24 24`}
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M14 3V7C14 7.55228 14.4477 8 15 8H19" stroke={stroke1} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path fillRule="evenodd" clipRule="evenodd" d="M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H14L19 8V19C19 20.1046 18.1046 21 17 21Z" stroke={stroke2} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 9H10" stroke={stroke2} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 13H15" stroke={stroke2} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 17H15" stroke={stroke2} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default FileTextIcon;

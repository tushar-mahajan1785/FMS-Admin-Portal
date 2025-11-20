import SvgIcon from '@mui/material/SvgIcon';

const FilesIcon = (props) => {
    const { stroke1 = "#101828", stroke2 = "#2F2B3D", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox={`0 0 24 24`}
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M15 3V7C15 7.55228 15.4477 8 16 8H20" stroke={stroke1} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path fillRule="evenodd" clipRule="evenodd" d="M18 17H11C9.89543 17 9 16.1046 9 15V5C9 3.89543 9.89543 3 11 3H15L20 8V15C20 16.1046 19.1046 17 18 17Z" stroke={stroke2} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 17V19C16 20.1046 15.1046 21 14 21H7C5.89543 21 5 20.1046 5 19V9C5 7.89543 5.89543 7 7 7H9" stroke={stroke2} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default FilesIcon;

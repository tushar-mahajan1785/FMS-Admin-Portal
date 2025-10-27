import SvgIcon from '@mui/material/SvgIcon';

const DocumentIcon = (props) => {
    const { stroke = "#181D27", size = 18, width = 18, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 18 22"
            fill="none"
            style={{ fontSize: size, width: width, color: 'transparent' }}
        >
            <path d="M11 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V7M11 1L17 7M11 1V7H17M13 12H5M13 16H5M7 8H5" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default DocumentIcon;

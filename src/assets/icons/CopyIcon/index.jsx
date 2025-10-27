import SvgIcon from '@mui/material/SvgIcon';

const CopyIcon = (props) => {
    const { stroke = "#181D27", size = 22, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 22 22"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M4 14H3C2.46957 14 1.96086 13.7893 1.58579 13.4142C1.21071 13.0391 1 12.5304 1 12V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V4M10 8H19C20.1046 8 21 8.89543 21 10V19C21 20.1046 20.1046 21 19 21H10C8.89543 21 8 20.1046 8 19V10C8 8.89543 8.89543 8 10 8Z" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default CopyIcon;

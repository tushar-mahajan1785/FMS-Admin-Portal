import SvgIcon from '@mui/material/SvgIcon';

const DownloadIcon = (props) => {
    const { stroke = "#181D27", size = 18, width = 18, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 18 22"
            fill="none"
            style={{ fontSize: size, width: width, color: 'transparent' }}
        >
            <path d="M19 13V17C19 17.5304 18.7893 18.0391 18.4142 18.4142C18.0391 18.7893 17.5304 19 17 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V13M5 8L10 13M10 13L15 8M10 13V1" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default DownloadIcon;

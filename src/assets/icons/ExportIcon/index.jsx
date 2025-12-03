import SvgIcon from '@mui/material/SvgIcon';

const ExportIcon = (props) => {
    const { stroke = "#6941C6", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox={`0 0 24 24`}
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <rect x="4" y="4" width="16" height="16" rx="2" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 10H20" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 4V20" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default ExportIcon;

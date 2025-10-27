import SvgIcon from '@mui/material/SvgIcon';

const IdBadgeIcon = (props) => {
    const { stroke1 = "#7F56D9", stroke2 = '#2F2B3D', size = 20, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 20 20"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <rect x="4.16663" y="2.50009" width="11.6667" height="15" rx="3" stroke={stroke2} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <ellipse cx="10" cy="10.8334" rx="1.66667" ry="1.66667" stroke={stroke1} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.33337 5.0001H11.6667" stroke={stroke1} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.5 15.0001H12.5" stroke={stroke2} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default IdBadgeIcon;

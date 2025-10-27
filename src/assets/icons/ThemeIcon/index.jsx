import SvgIcon from '@mui/material/SvgIcon';

const ThemeIcon = (props) => {
    const { stroke = "#2F2B3D", size = 25, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 25 25"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M19.543 3.80078H15.543C14.4384 3.80078 13.543 4.69621 13.543 5.80078V17.8008C13.543 20.0099 15.3338 21.8008 17.543 21.8008C19.7521 21.8008 21.543 20.0099 21.543 17.8008V5.80078C21.543 4.69621 20.6475 3.80078 19.543 3.80078" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.5428 8.15076L11.5428 6.15076C10.7618 5.36999 9.49584 5.36999 8.71484 6.15076L5.88684 8.97876C5.10608 9.75976 5.10608 11.0258 5.88684 11.8068L14.8868 20.8068" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.84297 13.8008H5.54297C4.4384 13.8008 3.54297 14.6962 3.54297 15.8008V19.8008C3.54297 20.9054 4.4384 21.8008 5.54297 21.8008H17.543" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17.543 17.8007V17.8107" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default ThemeIcon;

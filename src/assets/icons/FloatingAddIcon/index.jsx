import SvgIcon from '@mui/material/SvgIcon';

const FloatingAddIcon = (props) => {
    const { stroke = "#ffffffff", size = 22, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 20 22"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M8.2 20.1999H3.39999C2.0745 20.1999 0.999991 19.1254 1 17.7999L1.00009 3.39999C1.0001 2.07451 2.07462 1 3.40009 1H14.2004C15.5258 1 16.6004 2.07452 16.6004 3.4V10M15.1941 19.7882V16.3941M15.1941 16.3941V13M15.1941 16.3941L11.8 16.3941M15.1941 16.3941L18.5882 16.3941M5.20037 5.8H12.4004M5.20037 9.4H12.4004M5.20037 13H8.80038"
                stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        </SvgIcon>
    );
};

export default FloatingAddIcon;

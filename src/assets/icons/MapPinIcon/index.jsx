import SvgIcon from '@mui/material/SvgIcon';

const MapPinIcon = (props) => {
    const { stroke = "#717680", size = 14, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 14 14"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <circle cx="7" cy="6.4165" r="1.75" stroke={stroke} stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
            <path fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.2999 9.71641L7.82481 12.1915C7.3693 12.6466 6.63125 12.6466 6.17573 12.1915L3.70006 9.71641C1.87769 7.89394 1.87774 4.93922 3.70018 3.11681C5.52262 1.2944 8.47734 1.2944 10.2998 3.11681C12.1222 4.93922 12.1223 7.89394 10.2999 9.71641V9.71641Z"
                stroke={stroke} stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
        </SvgIcon>
    );
};

export default MapPinIcon;

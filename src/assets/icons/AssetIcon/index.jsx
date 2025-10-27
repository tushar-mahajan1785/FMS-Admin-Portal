import SvgIcon from '@mui/material/SvgIcon';

const AssetIcon = (props) => {
    const { stroke = "#2F2B3D", size = 16, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 20 20"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path
                d="M4.83596 7.83596H7.83596V4.83596L4.33596 1.33596C6.63041 0.240144 9.36642 0.70957 11.1644 2.50753C12.9623 4.30549 13.4318 7.0415 12.336 9.33596L18.336 15.336C19.1644 16.1644 19.1644 17.5075 18.336 18.336C17.5075 19.1644 16.1644 19.1644 15.336 18.336L9.33596 12.336C7.0415 13.4318 4.30549 12.9623 2.50753 11.1644C0.70957 9.36642 0.240144 6.63041 1.33596 4.33596L4.83596 7.83596"
                stroke={stroke}
                stroke-opacity="0.9"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round" />
        </SvgIcon>
    );
};

export default AssetIcon;

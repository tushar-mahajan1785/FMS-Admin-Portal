import SvgIcon from '@mui/material/SvgIcon';

const SuccessCircleCheckIcon = (props) => {
    const { stroke = "#00A63E", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox={`0 0 24 24`}
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M21.801 9.99999C22.2577 12.2413 21.9322 14.5714 20.8788 16.6018C19.8255 18.6322 18.1079 20.24 16.0125 21.1573C13.9171 22.0746 11.5706 22.2458 9.36428 21.6424C7.15795 21.0389 5.22517 19.6974 3.88825 17.8414C2.55134 15.9854 1.8911 13.7272 2.01764 11.4434C2.14418 9.15952 3.04986 6.98808 4.58363 5.29116C6.1174 3.59424 8.18656 2.47442 10.446 2.11844C12.7055 1.76247 15.0188 2.19185 17 3.33499" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 11L12 14L22 4" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default SuccessCircleCheckIcon;

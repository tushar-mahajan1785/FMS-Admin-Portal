import SvgIcon from '@mui/material/SvgIcon';

const CircleDashedIcon = (props) => {
    const { stroke = "#B692F6", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox={`0 0 24 24`}
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M8.55989 3.69141C7.46797 4.14339 6.47576 4.806 5.63989 5.64141" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.68997 8.55859C3.23653 9.64889 3.00207 10.8178 2.99997 11.9986" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.68994 15.4414C4.14193 16.5333 4.80454 17.5255 5.63994 18.3614" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.56006 20.3113C9.65036 20.7647 10.8192 20.9991 12.0001 21.0013" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.4399 20.3094C16.5319 19.8574 17.5241 19.1948 18.3599 18.3594" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20.31 15.44C20.7635 14.3497 20.9979 13.1808 21 12" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20.3101 8.56063C19.8581 7.46871 19.1955 6.47649 18.3601 5.64062" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.44 3.68875C14.3497 3.23531 13.1808 3.00085 12 2.99875" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default CircleDashedIcon;

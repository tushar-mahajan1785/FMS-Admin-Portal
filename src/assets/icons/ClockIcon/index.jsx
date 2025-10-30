import SvgIcon from '@mui/material/SvgIcon';

const ClockIcon = (props) => {
    const { stroke = "#717680", size = 20, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 20 20"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <g clipPath="url(#clip0_2706_6497)">
                <path d="M9.99996 5.00033V10.0003L13.3333 11.667M18.3333 10.0003C18.3333 14.6027 14.6023 18.3337 9.99996 18.3337C5.39759 18.3337 1.66663 14.6027 1.66663 10.0003C1.66663 5.39795 5.39759 1.66699 9.99996 1.66699C14.6023 1.66699 18.3333 5.39795 18.3333 10.0003Z"
                    stroke={stroke}
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_2706_6497">
                    <rect width="20" height="20" fill="white" />
                </clipPath>
            </defs>
        </SvgIcon>
    );
};

export default ClockIcon;

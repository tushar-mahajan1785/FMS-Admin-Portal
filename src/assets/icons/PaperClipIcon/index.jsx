import SvgIcon from '@mui/material/SvgIcon';

const PaperClipIcon = (props) => {
    const { stroke = "#717680", size = 14, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox={`0 0 14 14`}
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path
                d="M8.74996 4.08327L4.9583 7.87494C4.47505 8.35819 4.47505 9.14169 4.9583 9.62494C5.44155 10.1082 6.22505 10.1082 6.7083 9.62494L10.5 5.83327C11.4665 4.86677 11.4665 3.29977 10.5 2.33327C9.53347 1.36677 7.96646 1.36677 6.99996 2.33327L3.2083 6.12494C1.75855 7.57469 1.75855 9.92519 3.2083 11.3749C4.65804 12.8247 7.00855 12.8247 8.4583 11.3749L12.25 7.58327"
                stroke={stroke}
                strokeWidth="1.16667"
                strokeLinecap="round"
                strokeLinejoin="round" />

        </SvgIcon>
    );
};

export default PaperClipIcon;

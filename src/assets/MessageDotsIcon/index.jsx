import SvgIcon from '@mui/material/SvgIcon';

const MessageDotsIcon = (props) => {
    const { stroke = "#717680", size = 14, width = 14, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 14 14"
            fill="none"
            style={{ fontSize: size, width: width, color: 'transparent' }}
        >
            <path d="M2.33334 12.2498V4.6665C2.33334 3.70001 3.11685 2.9165 4.08334 2.9165H9.91668C10.8832 2.9165 11.6667 3.70001 11.6667 4.6665V8.1665C11.6667 9.133 10.8832 9.9165 9.91668 9.9165H4.66668L2.33334 12.2498" stroke={stroke}
                strokeWidth="1.16667"
                strokeLinecap="round"
                strokeLinejoin="round" />
            <path d="M7.00001 6.41668V6.42251" stroke={stroke} strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.66667 6.41668V6.42251" stroke={stroke} strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.33332 6.41668V6.42251" stroke={stroke} strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default MessageDotsIcon;

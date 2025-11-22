import SvgIcon from '@mui/material/SvgIcon';

const FileXIcon = (props) => {
    const { stroke = "#717680", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 24 24"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M14 3V7C14 7.55228 14.4477 8 15 8H19"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path fillRule="evenodd" clipRule="evenodd" d="M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H14L19 8V19C19 20.1046 18.1046 21 17 21Z"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round" />
            <path d="M10.5303 11.4697C10.2374 11.1768 9.76256 11.1768 9.46967 11.4697C9.17678 11.7626 9.17678 12.2374 9.46967 12.5303L10 12L10.5303 11.4697ZM13.4697 16.5303C13.7626 16.8232 14.2374 16.8232 14.5303 16.5303C14.8232 16.2374 14.8232 15.7626 14.5303 15.4697L14 16L13.4697 16.5303ZM14.5303 12.5303C14.8232 12.2374 14.8232 11.7626 14.5303 11.4697C14.2374 11.1768 13.7626 11.1768 13.4697 11.4697L14 12L14.5303 12.5303ZM9.46967 15.4697C9.17678 15.7626 9.17678 16.2374 9.46967 16.5303C9.76256 16.8232 10.2374 16.8232 10.5303 16.5303L10 16L9.46967 15.4697ZM10 12L9.46967 12.5303L13.4697 16.5303L14 16L14.5303 15.4697L10.5303 11.4697L10 12ZM14 12L13.4697 11.4697L9.46967 15.4697L10 16L10.5303 16.5303L14.5303 12.5303L14 12Z"
                fill={stroke} />

        </SvgIcon>
    );
};

export default FileXIcon;

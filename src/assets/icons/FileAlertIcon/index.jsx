import SvgIcon from '@mui/material/SvgIcon';

const FileAlertIcon = (props) => {
    const { stroke = "#101828", size = 20, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox={`0 0 20 20`}
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M10.5 2.25V5.25C10.5 5.66421 10.8358 6 11.25 6H14.25"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round" />
            <path fillRule="evenodd" clip-rule="evenodd" d="M12.75 15.75H5.25C4.42157 15.75 3.75 15.0784 3.75 14.25V3.75C3.75 2.92157 4.42157 2.25 5.25 2.25H10.5L14.25 6V14.25C14.25 15.0784 13.5784 15.75 12.75 15.75Z"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round" />
            <path d="M8.99991 12.75H9.00741"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round" />
            <path d="M9 8.25V10.5"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default FileAlertIcon;

import SvgIcon from '@mui/material/SvgIcon';

const FileInvoiceIcon = (props) => {
    const { stroke = "#717680", size = 20, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox={`0 0 20 20`}
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M11.6667 2.5V5.83333C11.6667 6.29357 12.0398 6.66667 12.5 6.66667H15.8334" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1667 17.5H5.83335C4.91288 17.5 4.16669 16.7538 4.16669 15.8333V4.16667C4.16669 3.24619 4.91288 2.5 5.83335 2.5H11.6667L15.8334 6.66667V15.8333C15.8334 16.7538 15.0872 17.5 14.1667 17.5Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.5 5.83464H8.33333" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.5 10.8346H12.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.8333 14.1667H12.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default FileInvoiceIcon;
